import type { Rubric, Template, Visual } from "@/lib/engine/types";

export type VisualSpec = Visual;

export interface TheoryBlock {
  heading: string;
  body: string; // lightweight markup: **bold**, $math$, blank line = paragraph
  visual?: VisualSpec;
}

export interface WorkedExample {
  title: string;
  problem: string;
  steps: { text: string; math?: string }[];
  why: string; // why the method works
  alternative?: string; // alternative strategy
}

export interface PupilCase {
  pupil: string;
  said: string;
  misconception: string;
  response: string; // how a teacher could respond
}

export interface TeacherTask {
  title: string;
  scenarios: string[]; // fictional pupil situations, one is chosen per attempt
  prompt: string;
  minChars: number;
  rubric: Rubric;
  modelAnswer: string;
}

export interface Lesson {
  id: string;
  worldId: string;
  title: string;
  summary: string;
  lgr: string; // curriculum area (paraphrased, see README)
  grades: string; // e.g. "åk 4–6"
  objectives: string[];
  intro: string;
  theory: TheoryBlock[];
  worked: WorkedExample[];
  drawing: { task: string; tool: "grid" | "numberline" | "fraction" | "fractioncircle" | "hundredgrid" | "area" | "coordinate" | "column" };
  pupils: PupilCase[];
  knowledge: Template[]; // gated knowledge test is drawn from these
  method: Template[]; // gated written-method section
  representation: Template[]; // gated representation section
  teacher: TeacherTask;
}

export interface World {
  id: string;
  index: number;
  title: string;
  tagline: string;
  icon: string;
  lgr: string;
  lessons: Lesson[];
  planned?: string[]; // lesson titles for worlds not yet built
}
