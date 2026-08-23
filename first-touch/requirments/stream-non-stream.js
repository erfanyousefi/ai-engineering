import "dotenv/config";
import OpenAI from "openai";
const client = new OpenAI({
  baseURL: process.env.OPENAI_ENDPOINT,
  apiKey: process.env.OPENAI_API_KEY,
});

const stream = await client.chat.completions.create({
  model: process.env.OPENAI_MODEL,
  stream: true,
  max_tokens: 300,

  messages: [
    {role: "user", content: "بیا یک داستان کامل با حداقل ۱۰ پاراگراف درباره هوش مصنوعی برام بنویس"},
  ],
});

for await (const chunk of stream) {
  const data = chunk?.choices?.[0]?.delta?.content;
  if (data) {
    process.stdout.write(data);
  }
}
