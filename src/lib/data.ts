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
  let subjectsToSearch = [subject];
  if (subject === "all" || !subject) {
    subjectsToSearch = Object.keys(DATA);
  }

  const questions: Question[] = [];

  subjectsToSearch.forEach((sub) => {
    const topicsToSearch = (topic === "all" || !topic) ? Object.keys(DATA[sub] || {}) : [topic];
    
    topicsToSearch.forEach((top) => {
      const topicData = DATA[sub]?.[top];
      if (!topicData) return;

      (Object.keys(topicData) as Difficulty[]).forEach((diff) => {
        const list = topicData[diff];
        if (Array.isArray(list)) {
          list.forEach((q: any) => {
            questions.push({
              ...q,
              difficulty: diff,
              topic: top,
              subject: sub,
            });
          });
        }
      });
    });
  });

  return questions;
}
