import { Hono } from "hono";
import { handle } from "hono/vercel";

import topicsRoute from "@/src/server/routes/topics";
import questionsRoute from "@/src/server/routes/questions";
import articlesRoute from "@/src/server/routes/articles";
import adminAuthRoute from "@/src/server/routes/adminAuth";
import adminArticlesRoute from "@/src/server/routes/adminArticles";
import adminQuestionsRoute from "@/src/server/routes/adminQuestions";
import adminUploadRoute from "@/src/server/routes/adminUpload";
import adminAnalyticsRoute from "@/src/server/routes/adminAnalytics";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.route("/topics", topicsRoute);
app.route("/questions", questionsRoute);
app.route("/articles", articlesRoute);
app.route("/admin", adminAuthRoute);
app.route("/admin/articles", adminArticlesRoute);
app.route("/admin/questions", adminQuestionsRoute);
app.route("/admin/upload", adminUploadRoute);
app.route("/admin/analytics", adminAnalyticsRoute);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);
export const PATCH = handle(app);
