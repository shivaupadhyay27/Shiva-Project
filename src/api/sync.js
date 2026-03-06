import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const userData = {};

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.post("/sync", (req, res) => {
  const { userId, date, score, timeTaken } = req.body;

  if (!userId || !date) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const today = new Date().toISOString().split("T")[0];
  if (date > today) {
    return res.status(400).json({ error: "Future date not allowed" });
  }

  if (score < 0 || score > 1000) {
    return res.status(400).json({ error: "Invalid score" });
  }

  if (timeTaken < 1 || timeTaken > 3600) {
    return res.status(400).json({ error: "Invalid time" });
  }

  if (!userData[userId]) {
    userData[userId] = {
      completedDates: new Set(),
      streak: 0
    };
  }

  const user = userData[userId];

  if (!user.completedDates.has(date)) {
    user.completedDates.add(date);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yDate = yesterday.toISOString().split("T")[0];

    if (user.completedDates.has(yDate)) {
      user.streak += 1;
    } else {
      user.streak = 1;
    }
  }

  res.json({
    message: "Synced",
    streak: user.streak,
    totalCompleted: user.completedDates.size
  });
});

app.listen(5000, () => {
  console.log("Puzzle backend running on port 5000");
});