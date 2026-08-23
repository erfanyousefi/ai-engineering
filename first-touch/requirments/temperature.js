import "dotenv/config";
import {appendFileSync} from "fs";
import OpenAI from "openai";
const client = new OpenAI({
  baseURL: process.env.OPENAI_ENDPOINT,
  apiKey: process.env.OPENAI_API_KEY,
});
const temps = [0, 0.5, 1, 1.5, 2];
for (const temp of temps) {
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    temperature: temp,
    messages: [
      {role: "user", content: "برای تولد ۲۲ سالگی دوستم یک متن برام بنویس که بهش تبریک بگم"},
    ],
  });

  const aiResponse = completion.choices?.[0]?.message?.content;
  appendFileSync(
    "msg.md",
    `
    Temperature: ${temp},
    ${aiResponse}
    ----------------------------------------------------------------

    `,
    "utf-8",
  );
}
