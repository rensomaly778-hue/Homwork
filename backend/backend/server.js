require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.FRONTEND_URL ||
  "http://localhost:5500,http://localhost:5501,http://127.0.0.1:5500,http://127.0.0.1:5501")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origin is not allowed"));
    }
  },
}));
app.use(express.json({ limit: "16kb" }));

// In-memory data store for this demo
let tasks = [
  { id: 1, title: "រៀន Frontend" },
  { id: 2, title: "រៀន Backend" },
];
let nextId = 3;

app.get("/", (req, res) => res.json({ status: "ok", message: "Backend is running" }));

app.get("/api/tasks", (req, res) => res.json(tasks));

app.post("/api/tasks", (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  if (!title) return res.status(400).json({ error: "title is required" });
  if (title.length > 200) return res.status(400).json({ error: "title must be 200 characters or fewer" });

  const task = { id: nextId++, title };
  tasks.push(task);
  res.status(201).json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "invalid task id" });

  const exists = tasks.some((task) => task.id === id);
  if (!exists) return res.status(404).json({ error: "task not found" });

  tasks = tasks.filter((task) => task.id !== id);
  res.json({ success: true });
});

app.use((req, res) => res.status(404).json({ error: "endpoint not found" }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
