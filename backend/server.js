const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new Database("database.db");

// Create sessions table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    correctAnswers INTEGER DEFAULT 0,
    totalAttempts INTEGER DEFAULT 0,
    duration INTEGER DEFAULT 0,
    score REAL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create a new game session
app.post("/sessions", (req, res) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO sessions (correctAnswers, totalAttempts, duration, score)
      VALUES (0, 0, 0, 0)
    `);

    const result = stmt.run();

    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: "Failed to create session" });
  }
});

// Update session when game finishes
app.put("/sessions/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { correctAnswers, totalAttempts, duration } = req.body;

    const score =
      totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0;

    const stmt = db.prepare(`
      UPDATE sessions
      SET correctAnswers = ?,
          totalAttempts = ?,
          duration = ?,
          score = ?
      WHERE id = ?
    `);

    const result = stmt.run(correctAnswers, totalAttempts, duration, score, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ message: "Session updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update session" });
  }
});

// Return aggregated stats
app.get("/stats", (req, res) => {
  try {
    const totalGames = db
      .prepare("SELECT COUNT(*) as count FROM sessions WHERE totalAttempts > 0")
      .get().count;

    const totals = db
      .prepare(
        `
        SELECT 
          SUM(correctAnswers) as totalCorrectAnswers,
          SUM(totalAttempts) as totalAttempts,
          SUM(duration) as totalDuration
        FROM sessions
        WHERE totalAttempts > 0
      `,
      )
      .get();

    const totalCorrectAnswers = totals.totalCorrectAnswers || 0;
    const totalAttempts = totals.totalAttempts || 0;
    const totalDuration = totals.totalDuration || 0;

    const averageScore =
      totalAttempts > 0
        ? Math.round((totalCorrectAnswers / totalAttempts) * 100)
        : 0;

    res.json({
      totalGames,
      totalCorrectAnswers,
      totalAttempts,
      totalDuration,
      averageScore,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.get("/", (req, res) => {
  res.send("Mini Education App Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
