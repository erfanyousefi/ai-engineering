import "dotenv/config";
import OpenAI from "openai";
import readline from "readline/promises";
const client = new OpenAI({
  baseUrl: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});
const MODEL = process.env.OPENAI_MODEL;
const SYSTEM_PROMPT =
  "تو یک دستیار هوش مصنوعی هستی که قراره به صورت دوستانه به من پاسخ بدی به عنوان یک دستیار آنلاین و همیشه به صورت فارسی پاسخ بده حد امکان مختصر پاسخ بده";

const history = [{role: "system", content: SYSTEM_PROMPT}];

async function streamChat(userMessage) {
  history.push({role: "user", content: userMessage});
  const stream = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    messages: history,
    stream: true,
    stream_options: {include_usage: true},
  });
  let fullResponse = "";
  for await (const chunk of stream) {
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) {
      process.stdout.write(delta);
      fullResponse += delta;
    }
  }
  history.push({role: "assistant", content: fullResponse});
}

async function main() {
  const rl = readline.createInterface({input: process.stdin, output: process.stdout});
  console.log("چت بات آماده پاسخ گویی میباشد.");
  console.log("خروج یا exit = پایان چت");
  while (true) {
    const question = await rl.question("شما: ");
    const text = question?.trim();
    if (!text) continue;
    if (text === "خروج" || text === "exit") break;
    if (text === "پاک" || text === "clear") {
      history.length = 1;
      console.log("تاریخچه پاک شد");
      continue;
    }
    try {
      await streamChat(text);
    } catch (error) {
      console.log(error);
    }
  }
  rl.close();
}

main();
