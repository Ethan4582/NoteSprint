// Backend
import nodejs from "../data/backend/nodejs";
import express from "../data/backend/express";
import mongodb from "../data/backend/mongodb";
import postgresql from "../data/backend/postgresql";
import aws_ from "../data/backend/aws_";
import azure_ from "../data/backend/azure_";
import drizzle_ from "../data/backend/drizzle_";
import fastapi_ from "../data/backend/fastapi_";
import graphql_ from "../data/backend/graphql_";
import grpc_ from "../data/backend/grpc_";
import hono_ from "../data/backend/hono_";
import langchain_ from "../data/backend/langchain_";
import langgraph_ from "../data/backend/langgraph_";
import prisma from "../data/backend/prisma";
import python from "../data/backend/python";
import redis from "../data/backend/redis";
import socketio_ from "../data/backend/socketio_";
import websocket_ from "../data/backend/websocket_";

// Frontend
import typescript from "../data/frontend/typescript";
import redux from "../data/frontend/redux";
import javascript from "../data/frontend/javascript";
import playwright_ from "../data/frontend/playwright_";
import testing from "../data/frontend/testing";

// CS Fundamentals
import operating_systeam from "../data/cs_fundamentals/operating_systeam";
import computer_network from "../data/cs_fundamentals/computer_network";
import cpp from "../data/cs_fundamentals/c++";
import dbms from "../data/cs_fundamentals/database_management";
import oops from "../data/cs_fundamentals/oops";
import sql from "../data/cs_fundamentals/sql";
import nextjs from "../data/frontend/nextjs";
import react from "../data/frontend/react";

// System Design
import lld from "../data/system_design/lld";
import hld from "../data/system_design/hld";

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

// Flat structure: each key matches an icon filename (without extension)
export const DATA: Record<string, any> = {
  nodejs,
  express,
  mongodb,
  postgresql,
  aws_,
  azure_,
  drizzle_,
  fastapi_,
  graphql_,
  grpc_,
  hono_,
  langchain_,
  langgraph_,
  prisma,
  python,
  redis,
  socketio_,
  websocket_,
  react,
  nextjs,
  typescript,
  redux,
  javascript,
  playwright_,
  testing,
  operating_systeam,
  computer_network,
  "c++": cpp,
  database_management: dbms,
  oops,
  sql,
  lld,
  hld,
};

export function getQuestions(subject: string | string[], topic: string | string[]): Question[] {
  // We ignore 'subject' now as each topic is independent
  const topicsToSearch = Array.isArray(topic)
    ? topic
    : (topic === "all" || !topic ? Object.keys(DATA) : [topic]);

  const questions: Question[] = [];

  topicsToSearch.forEach((top) => {
    const topicData = DATA[top];
    if (!topicData) return;

    if (Array.isArray(topicData)) {
      topicData.forEach((q: any) => {
        questions.push({
          ...q,
          topic: top,
          subject: "Tech",
        });
      });
    } else if (topicData && typeof topicData === 'object') {
      // Handle categorized structure (Theory, Coding)
      const allQs = [
        ...(topicData.Theory || []),
        ...(topicData.Coding || [])
      ];
      allQs.forEach((q: any) => {
        questions.push({
          ...q,
          topic: top,
          subject: "Tech",
        });
      });
    }
  });

  return questions;
}
