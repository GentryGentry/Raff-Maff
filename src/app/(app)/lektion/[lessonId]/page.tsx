"use client";
import { use } from "react";
import { LessonPlayer } from "@/components/LessonPlayer";
import { getLesson } from "@/lib/content";

export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const lesson = getLesson(lessonId);
  if (!lesson) return <div className="p-6">Okänd lektion.</div>;
  return <LessonPlayer lesson={lesson} />;
}
