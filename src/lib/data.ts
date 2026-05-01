import nodejs from "../data/backend/nodejs";
import express from "../data/backend/express";
import mongodb from "../data/backend/mongodb";
import postgres from "../data/backend/postgres";

import react from "../data/frontend/react";
import nextjs from "../data/frontend/nextjs";
import typescript from "../data/frontend/typescript";
import state_management from "../data/frontend/state_management";

import system_design from "../data/system_design/lld";
import os from "../data/cs_fundamentals/os";
import networks from "../data/cs_fundamentals/networks";

export interface Question {
  id: number;
  question: string;
  answer?: string;
  image?: string;
  image2?: string;
  code?: string;
  topic: string;
  subject: string;
  category?: string;
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

export function getQuestions(subject: string | string[], topic: string | string[]): Question[] {
  const subjectsToSearch = Array.isArray(subject) 
    ? subject 
    : (subject === "all" || !subject ? Object.keys(DATA) : [subject]);

  const questions: Question[] = [];

  subjectsToSearch.forEach((sub) => {
    const topicsToSearch = Array.isArray(topic)
      ? topic.filter(t => DATA[sub]?.[t])
      : (topic === "all" || !topic ? Object.keys(DATA[sub] || {}) : [topic]);
    
    topicsToSearch.forEach((top) => {
      const topicData = DATA[sub]?.[top];
      if (!topicData) return;

      if (Array.isArray(topicData)) {
        topicData.forEach((q: any) => {
          questions.push({
            ...q,
            topic: top,
            subject: sub,
          });
        });
      } else if (typeof topicData === 'object') {
        Object.entries(topicData).forEach(([category, items]) => {
          if (Array.isArray(items)) {
            items.forEach((q: any) => {
              questions.push({
                ...q,
                topic: top,
                subject: sub,
                category: category,
              });
            });
          }
        });
      }
    });
  });

  return questions;
}
