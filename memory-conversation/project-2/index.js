import {ChatOpenAI} from "@langchain/openai";
import "dotenv/config";
import readline from "node:readline/promises";
import {appendMessage, clearHistory, loadHistory} from "./memory.js";

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  temperature: 0.5,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  },
});

const SYSTEM_PROMPT = "تو یک دستیار مفید و درستانه هستی، کوتاه و مختصر با زبان فارسی پاسخ بده";
const SESSION_ID = "demo-user-1";
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const userText = await rl.question("You: ");
    if (userText.trim() === "exit") {
      break;
    }
    if (userText.trim() === "clear") {
      await clearHistory(SESSION_ID);
      console.log("clear history successfully");
      continue;
    }

    const history = await loadHistory(SESSION_ID);
    const messages = [
      {role: "system", content: SYSTEM_PROMPT},
      ...history,
      {role: "user", content: userText},
    ];
    const reply = await model.invoke(messages);
    console.log("AI: ", reply.content);

    await appendMessage(SESSION_ID, "user", userText);
    await appendMessage(SESSION_ID, "assistant", reply.content);
  }
  rl.close();
  process.exit(0);
}
main();
