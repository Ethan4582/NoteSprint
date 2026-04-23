import nodejs from "../data/backend/nodejs";
import express from "../data/backend/express";
import mongodb from "../data/backend/mongodb";
import postgres from "../data/backend/postgres";

import react from "../data/frontend/react";
import nextjs from "../data/frontend/nextjs";
import typescript from "../data/frontend/typescript";
import state_management from "../data/frontend/state_management";

import system_design from "../data/system_design/fundamentals";
import os from "../data/cs_fundamentals/os";
import networks from "../data/cs_fundamentals/networks";

export type Difficulty = "Basic" | "Medium" | "Hard";

export interface Question {
  id: number;
  question: string;
  answer?: string;
  image?: string;
  image2?: string;
  code?: string;
  difficulty: Difficulty;
  topic: string;
  subject: string;
}

export const DATA: Record<string, Record<string, any>> = {
  backend: {
    nodejs,
    express,
    mongodb,
    postgres,
  },
  frontend: {
    react,
    nextjs,
    typescript,
    state_management,
  },
  "system design": {
    fundamentals: system_design,
  },
  "cs fundamentals": {
    os,
    networks,
  },
};

export function getQuestions(subject: string, topic: string): Question[] {
  const topicData = DATA[subject]?.[topic];
  if (!topicData) return [];

  const questions: Question[] = [];
  (Object.keys(topicData) as Difficulty[]).forEach((diff) => {
    const list = topicData[diff];
    if (Array.isArray(list)) {
      list.forEach((q: any) => {
        questions.push({
          ...q,
          difficulty: diff,
          topic,
          subject,
        });
      });
    }
  });

  return questions;
}
