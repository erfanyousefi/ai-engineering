import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_ENDPOINT,
});

const MODEL = process.env.OPENAI_MODEL;

const lorem = `
متن ساختگی برای افزایش تعداد توکن‌ها.
این متن هیچ کاربرد خاصی ندارد و فقط برای شبیه‌سازی یک تاریخچه طولانی استفاده می‌شود.
`.repeat(20);

const history = [
  {
    role: "system",
    content: "تو یک دستیار مفید هستی.",
  },
];

const HISTORY_SIZE = 20;

for (let i = 1; i <= HISTORY_SIZE; i++) {
  history.push({
    role: "user",
    content: `پیام شماره ${i}\n${lorem}`,
  });

  history.push({
    role: "assistant",
    content: `پاسخ شماره ${i}\n${lorem}`,
  });
}

history.push({
  role: "user",
  content: "الان فقط کلمه سلام را بنویس.",
});

const response = await client.chat.completions.create({
  model: MODEL,
  messages: history,
});

console.log(tokenCost(response.usage?.prompt_tokens, response.usage.completion_tokens));

// Input = 1M = 3$
// Output = 1M = 15$

//Input = 1000 * 3 / 1_000_000
//Output = 500 * 15 / 1_000_000

function tokenCost(inputToken, outputToken) {
  const inRate = parseFloat(3 / 1_000_000);
  const outRate = parseFloat(15 / 1_000_000);
  return inputToken * inRate + outputToken * outRate;
}
