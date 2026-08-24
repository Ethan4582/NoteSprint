import { Hono } from "hono";
import { insertQuestion, updateQuestion, deleteQuestion } from "@/src/db";

const adminQuestionsRoute = new Hono();

adminQuestionsRoute.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const result = await insertQuestion({
      topicId: body.topicId || 1,
      question: body.question,
      answer: body.answer,
      imageUrl: body.imageUrl || null,
      sourceFile: body.sourceFile || "admin",
    });

    return c.json(
      result[0] || {
        id: Date.now(),
        topicId: body.topicId || 1,
        question: body.question,
        answer: body.answer,
        imageUrl: body.imageUrl || null,
        sourceFile: body.sourceFile || "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      201
    );
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

adminQuestionsRoute.put("/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) return c.json({ error: "Invalid question id" }, 400);

    const body = await c.req.json();
    const updated = await updateQuestion(id, {
      topicId: body.topicId ? Number(body.topicId) : undefined,
      question: body.question,
      answer: body.answer,
      imageUrl: body.imageUrl !== undefined ? body.imageUrl : undefined,
    });

    if (!updated || updated.length === 0) {
      return c.json({ error: "Question not found" }, 404);
    }

    return c.json(updated[0]);
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

adminQuestionsRoute.delete("/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) return c.json({ error: "Invalid question id" }, 400);

    const deleted = await deleteQuestion(id);
    if (!deleted || deleted.length === 0) {
      return c.json({ error: "Question not found" }, 404);
    }

    return c.json({ success: true, deleted: deleted[0] });
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

export default adminQuestionsRoute;
