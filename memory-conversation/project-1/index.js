import {ChatOpenAI} from "@langchain/openai";
import "dotenv/config";
import readline from "node:readline/promises";
const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  temperature: 0.5,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  },
});

const conversationHistory = [
  {
    role: "system",
    content: "تو یک دستیار مفید و درستانه هستی، کوتاه و مختصر با زبان فارسی پاسخ بده",
  },
];

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
    conversationHistory.push({role: "user", content: userText});
    const reply = await model.invoke(conversationHistory);
    console.log("AI: ", reply.content);
    conversationHistory.push({role: "assistant", content: reply.content});
  }
  rl.close();
}
main();
