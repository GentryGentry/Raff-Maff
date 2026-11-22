import { ALL_LESSONS, BUILT_WORLDS, bossId, bossWorldId, getLesson, getWorld, isBossId } from "@/lib/content";
import { ACHIEVEMENTS, newlyEarned, publicAchievements, type AchCtx } from "@/lib/engine/achievements";
import { academyVariants, generateAssessment, gradeSet, knownLessonId, PASS_THRESHOLD, variantOf, type AssessmentKind } from "@/lib/engine/assessment";
import { lessonMastery, overallCompletion, pedagogySummary, weakSkills, worldMastery } from "@/lib/engine/mastery";
import { randomSeed } from "@/lib/engine/rng";
import { isRepeatable, lessonOfSkill, recommend, updateRevision } from "@/lib/engine/revision";
import { bossUnlocked, lessonUnlocked, nextLesson, worldUnlocked, type ProgressMap } from "@/lib/engine/unlock";
import { levelInfo, nextStreak, stockholmDate, XP } from "@/lib/engine/xp";
import type { Answer, ConcreteExercise, ItemResult, Section } from "@/lib/engine/types";
import { SECTIONS } from "@/lib/engine/types";
import { reviewExplanation } from "./ai";
import { gradeRubric } from "@/lib/engine/grading";
import { aiConfigured } from "./config";
import { HttpError } from "./auth";
import { signToken, verifyToken } from "./token";
import type { AttemptRow, Profile, ProgressRow, Store } from "./types";

const emptySections = (): Record<Section, boolean> => ({ knowledge: false, method: false, representation: false, pedagogy: false });
const nowIso = () => new Date().toISOString();

function blankProgress(userId: string, lessonId: string): ProgressRow {
  return { user_id: userId, lesson_id: lessonId, status: "in_progress", theory_done: false, sections: emptySections(), best_knowledge: 0, practice_xp: 0, xp_awarded: 0, completed_at: null, last_practiced_at: null, updated_at: nowIso() };
}

async function loadAll(store: Store, userId: string) {
  const [progress, attempts, stats, revision, ach] = await Promise.all([
    store.listProgress(userId), store.listAttempts(userId, 300), store.listSkillStats(userId), store.listRevision(userId), store.listAchievements(userId),
  ]);
  const map: ProgressMap = Object.fromEntries(progress.map((p) => [p.lesson_id, p]));
  return { progress, attempts, stats, revision, ach, map };
}

export async function buildState(store: Store, userId: string, name?: string) {
  const profile = await store.ensureProfile(userId, name);
  const { progress, attempts, stats, revision, ach, map } = await loadAll(store, userId);
  const unlocked: Record<string, boolean> = {};
  const mastery: Record<string, ReturnType<typeof lessonMastery>> = {};
  for (const l of ALL_LESSONS) { unlocked[l.id] = lessonUnlocked(l.id, map); mastery[l.id] = lessonMastery(l.id, map, attempts); }
  const worlds: Record<string, { unlocked: boolean; bossUnlocked: boolean; bossPassed: boolean } & ReturnType<typeof worldMastery>> = {};
  for (const w of BUILT_WORLDS) worlds[w.id] = { unlocked: worldUnlocked(w.id, map), bossUnlocked: bossUnlocked(w.id, map), bossPassed: map[bossId(w.id)]?.status === "completed", ...worldMastery(w.id, map, attempts) };
  const recs = recommend({ progress, attempts, revision, stats });
  const next = nextLesson(map);
  const recent = [...progress].filter((p) => p.status === "completed" && p.completed_at).sort((a, b) => (b.completed_at! > a.completed_at! ? 1 : -1)).slice(0, 5).map((p) => ({ lessonId: p.lesson_id, at: p.completed_at! }));
  const have = new Map(ach.map((a) => [a.achievement_id, a.unlocked_at]));
  return {
    profile, level: levelInfo(profile.xp), progress: map, unlocked, mastery, worlds,
    completion: overallCompletion(map),
    next, recent, recommendations: recs.slice(0, 8),
    achievements: publicAchievements.map((a) => ({ ...a, unlockedAt: have.get(a.id) ?? null })),
    pedagogy: pedagogySummary(attempts),
    weak: weakSkills(stats).slice(0, 6).map((s) => ({ skill: s.skill, lessonId: s.lesson_id, wrong: s.wrong, total: s.correct + s.wrong })),
    attempts: attempts.slice(-15).reverse().map((a) => ({ id: a.id, lessonId: a.lesson_id, section: a.section, score: a.score, max: a.max_score, passed: a.passed, at: a.created_at })),
    revisionDue: recs.length,
  };
}
export type ClientState = Awaited<ReturnType<typeof buildState>>;

function touch(profile: Profile) {
  const today = stockholmDate();
  profile.streak = nextStreak(profile.last_active_date, profile.streak, today);
  profile.longest_streak = Math.max(profile.longest_streak, profile.streak);
  profile.last_active_date = today;
}

async function grantAchievements(store: Store, userId: string, profile: Profile) {
  const { progress, attempts, ach } = await loadAll(store, userId);
  const ctx: AchCtx = { profile, progress, attempts, bossesPassed: progress.filter((p) => p.lesson_id.endsWith("-boss") && p.status === "completed").length };
  const earned = newlyEarned(ctx, new Set(ach.map((a) => a.achievement_id)));
  if (earned.length) {
    await store.addAchievements(userId, earned.map((a) => a.id));
    profile.xp += earned.reduce((s, a) => s + a.xp, 0);
    await store.saveProfile(profile);
  }
  return earned.map(({ test: _t, ...d }) => { void _t; return d; });
}

export async function completeTheory(store: Store, userId: string, lessonId: string) {
  const lesson = getLesson(lessonId);
  if (!lesson) throw new HttpError(404, "Okänd lektion.");
  const profile = await store.ensureProfile(userId);
  const { map } = await loadAll(store, userId);
  if (!lessonUnlocked(lessonId, map)) throw new HttpError(403, "Lektionen är låst.");
  const row = map[lessonId] ?? blankProgress(userId, lessonId);
  let xp = 0;
  if (!row.theory_done) { row.theory_done = true; xp = XP.theory; profile.xp += xp; }
  row.last_practiced_at = nowIso(); row.updated_at = nowIso();
  profile.current_lesson_id = lessonId;
  touch(profile);
  await store.saveProgress(row);
  await store.saveProfile(profile);
  const newAchievements = await grantAchievements(store, userId, profile);
  return { xp, newAchievements };
}

export async function submitPractice(store: Store, userId: string, lessonId: string, results: { skill: string; correct: boolean }[]) {
  const lesson = getLesson(lessonId);
  if (!lesson) throw new HttpError(404, "Okänd lektion.");
  const profile = await store.ensureProfile(userId);
  const { map, stats, revision } = await loadAll(store, userId);
  if (!lessonUnlocked(lessonId, map)) throw new HttpError(403, "Lektionen är låst.");
  const row = map[lessonId] ?? blankProgress(userId, lessonId);
  const valid = results.filter((r) => typeof r.skill === "string" && r.skill.startsWith(lessonId + ".")).slice(0, 25);
  const right = valid.filter((r) => r.correct).length;
  const xp = Math.max(0, Math.min(right * XP.practiceCorrect, XP.practiceCapPerLesson - row.practice_xp));
  row.practice_xp += xp; profile.xp += xp;
  row.last_practiced_at = nowIso(); row.updated_at = nowIso();
  await applySkillResults(store, userId, valid, stats, revision);
  profile.current_lesson_id = lessonId;
  touch(profile);
  await store.saveProgress(row); await store.saveProfile(profile);
  return { xp, newAchievements: await grantAchievements(store, userId, profile) };
}

async function applySkillResults(store: Store, userId: string, items: { skill: string; correct: boolean }[], stats: Awaited<ReturnType<typeof loadAll>>["stats"], revision: Awaited<ReturnType<typeof loadAll>>["revision"]) {
  const sMap = new Map(stats.map((s) => [s.skill, { ...s }]));
  const rMap = new Map(revision.map((r) => [`${r.lesson_id}|${r.skill}`, r]));
  const changedR = new Map<string, NonNullable<ReturnType<typeof updateRevision>>>();
  const now = nowIso();
  for (const it of items.filter((i) => isRepeatable(i.skill))) {
    const s = sMap.get(it.skill) ?? { user_id: userId, skill: it.skill, lesson_id: lessonOfSkill(it.skill), correct: 0, wrong: 0, last_practiced: now };
    if (it.correct) s.correct++; else s.wrong++;
    s.last_practiced = now; sMap.set(it.skill, s);
    const key = `${lessonOfSkill(it.skill)}|${it.skill}`;
    const upd = updateRevision(changedR.get(key) ?? rMap.get(key), userId, it.skill, it.correct);
    if (upd) changedR.set(key, upd);
  }
  await store.saveSkillStats([...sMap.values()].filter((s) => items.some((i) => i.skill === s.skill)));
  await store.saveRevision([...changedR.values()]);
}

type StartKind = AssessmentKind;
const STARTABLE: StartKind[] = ["knowledge", "method", "representation", "pedagogy", "boss", "revision", "academy"];

export async function startAssessment(store: Store, userId: string, lessonId: string, kind: StartKind) {
  if (!STARTABLE.includes(kind)) throw new HttpError(400, "Ogiltig typ.");
  const { map, progress, attempts, stats, revision } = await loadAll(store, userId);
  let skills: string[] | undefined;
  let lid = lessonId;
  if (kind === "revision") {
    const recs = recommend({ progress, attempts, revision, stats }).slice(0, 4);
    if (!recs.length) throw new HttpError(409, "Inget att repetera just nu – bra jobbat!");
    skills = [];
    for (const r of recs) {
      if (r.skill) skills.push(r.skill);
      else { const l = getLesson(r.lessonId); if (l) skills.push(...[...l.knowledge, ...l.method].map((t) => t.skill)); }
    }
    skills = [...new Set(skills)].filter(isRepeatable);
    lid = recs[0].lessonId;
  } else {
    if (!knownLessonId(lessonId)) throw new HttpError(404, "Okänd lektion.");
    if (kind === "boss") {
      if (!isBossId(lessonId)) throw new HttpError(400, "Ogiltigt boss-id.");
      if (!bossUnlocked(bossWorldId(lessonId), map)) throw new HttpError(403, "Klara alla lektioner i världen först.");
    } else {
      if (isBossId(lessonId)) throw new HttpError(400, "Ogiltig typ för bossutmaning.");
      if (!lessonUnlocked(lessonId, map)) throw new HttpError(403, "Lektionen är låst.");
      if (!map[lessonId]?.theory_done) throw new HttpError(403, "Läs igenom lektionen innan du gör provet.");
    }
  }
  let seed = randomSeed();
  if (kind === "academy") {
    // Variera övningen: lärarutmaningen och (med AI) elevfallen från lektionen, aldrig samma som förra gången.
    const l = getLesson(lid);
    const n = l ? academyVariants(l, aiConfigured()) : 1;
    const last = attempts.filter((a) => a.section === "academy" && a.lesson_id === lid).sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
    const options = Array.from({ length: n }, (_, i) => i).filter((i) => n === 1 || !last || i !== variantOf(last.seed));
    seed += `~v${options[Math.floor(Math.random() * options.length)]}`;
  }
  const { token } = signToken({ u: userId, l: lid, k: kind, s: seed, sk: skills });
  const exercises = generateAssessment(lid, kind, seed, { skills });
  if (!exercises.length) throw new HttpError(kind === "revision" ? 409 : 404, kind === "revision" ? "Inget att repetera just nu." : "Inga uppgifter hittades.");
  return { token, kind, lessonId: lid, threshold: PASS_THRESHOLD[kind], exercises: exercises.map((e) => e.spec) };
}

/** Facit för förklaringar visas först när man blivit godkänd, så att det inte går att kopiera ett exempelsvar efter ett underkänt försök. */
export function publicItem(it: ItemResult, ex: ConcreteExercise) {
  const isText = ex.solution.kind === "text";
  return { ...it, explanation: isText && !it.correct ? "" : ex.explanation, correctAnswerText: isText ? (it.correct ? (ex.solution as { modelAnswer: string }).modelAnswer : undefined) : it.correctAnswerText };
}

export async function submitAssessment(store: Store, userId: string, token: string, answers: (Answer | undefined)[]) {
  const p = verifyToken(token);
  if (!p || p.u !== userId) throw new HttpError(400, "Ogiltig eller utgången provnyckel. Starta om provet.");
  const kind = p.k as AssessmentKind;
  const exercises = generateAssessment(p.l, kind, p.s, { skills: p.sk });
  if (!exercises.length) throw new HttpError(400, "Provet kunde inte återskapas.");
  const graded = gradeSet(kind, exercises, answers.slice(0, exercises.length));

  // Lärarförklaringar: regelverket är generöst och, när AI finns, avgör AI om en förklaring som klarat grundskydden är korrekt.
  // AI kan alltså godkänna en förklaring med egna ord som regelverket missade, och underkänna en som har fel.
  let aiFeedback: string | undefined;
  if (kind === "pedagogy" || kind === "academy") {
    const ex = exercises[0];
    const item = graded.items[0];
    if (ex.solution.kind === "text" && ex.spec.kind === "text") {
      const text = (answers[0] as { value?: string })?.value ?? "";
      const g = gradeRubric(text, ex.solution.rubric, ex.spec.minChars);
      const review = g.guardsOk ? await reviewExplanation({ scenario: ex.spec.scenario ?? "", prompt: ex.spec.prompt, answer: text, modelAnswer: ex.solution.modelAnswer, concepts: ex.solution.rubric.concepts.map((c) => c.label) }) : null;
      if (ex.solution.rubric.aiOnly && g.guardsOk && !review) throw new HttpError(502, "AI-bedömningen svarade inte just nu. Försök skicka igen om en stund.");
      if (review) {
        aiFeedback = review.feedback;
        if (review.ok && !item.correct) {
          item.correct = true; item.points = item.max; item.feedback = "Godkänd. " + review.feedback;
          graded.points = graded.max; graded.ratio = 1; graded.passed = true;
        } else if (!review.ok && item.correct) {
          item.correct = false; item.points = 0; item.feedback = "AI-granskningen hittade brister: " + review.feedback; graded.points = 0; graded.ratio = 0; graded.passed = false;
        } else if (!review.ok) {
          item.feedback = item.feedback + " " + review.feedback;
        }
      }
    }
  }

  const profile = await store.ensureProfile(userId);
  const { map, stats, revision, attempts } = await loadAll(store, userId);
  let xp = 0;
  let lessonCompleted = false;
  let bossPassed = false;

  const mistakes = graded.items.map((it, i) => ({ it, ex: exercises[i] })).filter(({ it }) => !it.correct).map(({ it, ex }) => ({ skill: it.skill, kind: it.kind, prompt: ex.spec.prompt.slice(0, 200) }));
  const attempt: AttemptRow = { id: crypto.randomUUID(), user_id: userId, lesson_id: p.l, section: kind, nonce: p.n, seed: p.s, score: graded.points, max_score: graded.max, passed: graded.passed, xp: 0, mistakes, created_at: nowIso() };

  // award XP
  const today = stockholmDate();
  const todaysAttempts = attempts.filter((a) => a.created_at.slice(0, 10) === new Date().toISOString().slice(0, 10) || stockholmDate(new Date(a.created_at)) === today);
  if (kind === "revision") {
    const used = todaysAttempts.filter((a) => a.section === "revision").reduce((s, a) => s + a.xp, 0);
    xp = Math.max(0, Math.min(graded.items.filter((i) => i.correct).length * XP.revisionCorrect, XP.revisionDailyCap - used));
  } else if (kind === "academy") {
    const used = todaysAttempts.filter((a) => a.section === "academy").reduce((s, a) => s + a.xp, 0);
    if (graded.passed) xp = Math.max(0, Math.min(XP.academy, XP.academyDailyCap - used));
  }

  let row: ProgressRow | undefined;
  if (kind === "boss") {
    row = map[p.l] ?? blankProgress(userId, p.l);
    row.best_knowledge = Math.max(row.best_knowledge, graded.ratio);
    if (graded.passed && row.status !== "completed") { row.status = "completed"; row.completed_at = nowIso(); row.sections = { knowledge: true, method: true, representation: true, pedagogy: true }; xp += XP.boss; row.xp_awarded += XP.boss; bossPassed = true; }
  } else if ((SECTIONS as string[]).includes(kind)) {
    const sec = kind as Section;
    row = map[p.l] ?? blankProgress(userId, p.l);
    if (graded.passed && !row.sections[sec]) { row.sections[sec] = true; const gain = XP.section[sec]; xp += gain; row.xp_awarded += gain; }
    if (sec === "knowledge") row.best_knowledge = Math.max(row.best_knowledge, graded.ratio);
    if (row.status !== "completed" && SECTIONS.every((s) => row!.sections[s])) { row.status = "completed"; row.completed_at = nowIso(); xp += XP.lessonComplete; row.xp_awarded += XP.lessonComplete; lessonCompleted = true; }
  }
  if (row) { row.last_practiced_at = nowIso(); row.updated_at = nowIso(); }

  const fresh = await store.insertAttempt({ ...attempt, xp });
  if (!fresh) throw new HttpError(409, "Provet är redan inlämnat.");
  if (row) await store.saveProgress(row);
  profile.xp += xp;
  touch(profile);
  if (kind !== "revision" && kind !== "academy" && !isBossId(p.l)) profile.current_lesson_id = p.l;
  await store.saveProfile(profile);
  await applySkillResults(store, userId, graded.items.map((i) => ({ skill: i.skill, correct: i.correct })), stats, revision);
  const newAchievements = await grantAchievements(store, userId, profile);

  const strip = publicItem;

  return {
    kind, lessonId: p.l, passed: graded.passed, points: graded.points, max: graded.max, ratio: graded.ratio,
    threshold: PASS_THRESHOLD[kind], xp, lessonCompleted, bossPassed, aiFeedback,
    items: graded.items.map((it, i) => strip(it, exercises[i])),
    sections: row?.sections ?? null,
    newAchievements,
  };
}

export { getWorld };
export const _achievementCount = ACHIEVEMENTS.length;
