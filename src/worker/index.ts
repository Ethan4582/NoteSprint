import { Hono } from "hono";
import { cors } from "hono/cors";
import { topicsRouter } from "./routes/topics";
import { questionsRouter } from "./routes/questions";
import { articlesRouter } from "./routes/articles";
import { adminRouter } from "./routes/admin";
import type { Env, Variables } from "./types";

const app = new Hono<{
  Bindings: Env;
  Variables: Variables;
}>();

app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.route("/api/topics", topicsRouter);
app.route("/api", questionsRouter);
app.route("/api/articles", articlesRouter);
app.route("/admin", adminRouter);

app.get("/", (c) => {
  return c.json({
    name: "NoteSprint Cloudflare Worker API",
    status: "healthy",
    version: "1.0.0",
  });
});

app.onError((err, c) => {
  console.error("Worker error:", err);
  return c.json({ error: err.message || "Internal Server Error" }, 500);
});

export default app;
