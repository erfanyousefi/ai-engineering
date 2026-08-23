import "dotenv/config";
import express from "express";
import {chat} from "./chatService.js";
import {clearHistory, loadHistory} from "./memory.js";

const app = express();
app.use(express.json());

app.post("/chat/:sessionId", async (req, res) => {
  const {sessionId} = req.params;
  const {message} = req.body || {};
  if (!message) {
    return res.status(400).json({
      error: "فیلد message الزامی میباشد",
    });
  }
  try {
    const reply = await chat(sessionId, message);
    res.json({sessionId, reply});
  } catch (error) {
    res.status(500).json({error: error?.message});
  }
});
app.get("/chat/:sessionId", async (req, res) => {
  const {sessionId} = req.params;
  const {messages, summary} = await loadHistory(sessionId);
  res.json({
    summary,
    messages,
  });
});
app.delete("/chat/:sessionId", async (req, res) => {
  const {sessionId} = req.params;
  await clearHistory(sessionId);
  res.json({
    ok: true,
  });
});

app.listen(3000, () => {
  console.log("server run on port 3000");
});
