import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { thai, romanization } = req.body;

    if (!thai || typeof thai !== "string") {
      return res.status(400).json({ error: "thai is required" });
    }

    const result = await db.query(
      `INSERT INTO words (thai, romanization)
       VALUES ($1, $2)
       RETURNING id, thai, romanization, created_at`,
      [thai, romanization ?? null]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "database error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      `SELECT id, thai, romanization, created_at
       FROM words
       WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "word not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "database error" });
  }
});

export default router;
