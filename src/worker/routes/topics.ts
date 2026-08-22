import { Hono } from "hono";
import { createDb, getAllTopics } from "../../db";
import type { Env, Variables } from "../types";

export const topicsRouter = new Hono<{
  Bindings: Env;
  Variables: Variables;
}>();

topicsRouter.get("/", async (c) => {
  const db = createDb(c.env.DB);
  const result = await getAllTopics(db);
  return c.json(result);
});
