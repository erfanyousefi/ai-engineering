import "dotenv/config";
import OpenAI from "openai";
import readline from "readline/promises";
import {callWithRetry} from "./utils.js";
const client = new OpenAI({
  baseURL: process.env.ARVANCLOUD_MODEL_ENDPOINT,
  apiKey: process.env.ARVANCLOUD_API_KEY,
});

const MODEL = "Claude-Haiku-4.5";
const SYSTEM_PROMPT =
  "تو یک دستیار مفید و دوستانه هستی، همیشه به صورت فارسی پاسخ بده و درحد امکان مختصر و مفید";
const history = [{role: "system", content: SYSTEM_PROMPT}];

async function streamChat(userMessage) {
  history.push({role: "user", content: userMessage});
  const stream = await callWithRetry(() =>
    client.chat.completions.create({
      model: MODEL,
      max_tokens: 1024,
      messages: history,
      stream: true,
      stream_options: {include_usage: true},
    }),
  );
  let fullText = "";
  let usage = {prompt_tokens: 0, completion_tokens: 0};
  process.stdout.write("\n ربات: ");
  for await (const chunk of stream) {
    const delta = chunk?.choices?.[0]?.delta?.content;
    if (delta) {
      process.stdout.write(delta);
      fullText += delta;
    }
    if (chunk.usage) usage = chunk.usage;
  }
  history.push({role: "assistant", content: fullText});
}

async function main() {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log("چت بات آماده است.");
  console.log("دستورات: پاک = پاک کردن تاریخچه | خروج = پایان چت");
  while (true) {
    const question = await readlineInterface.question("شما: ");
    if (question.trim() === "exit" || question.trim() == "خروج") break;
    if (question.trim() === "clear" || question.trim() == "پاک") {
      history.length = 1;
      console.log("تاریخچه با موفقیت پاک شد");
      continue;
    }
    if (!question.trim()) continue;
    try {
      await streamChat(question);
    } catch (error) {
      console.log(error);
    }
  }
  readlineInterface.close();
  console.log("Goodby!");
}

main();
