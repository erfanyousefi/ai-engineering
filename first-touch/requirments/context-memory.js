import "dotenv/config";
import OpenAI from "openai";
const client = new OpenAI({
  baseURL: process.env.OPENAI_ENDPOINT,
  apiKey: process.env.OPENAI_API_KEY,
});
const history = [];
history.push({
  role: "user",
  content: "اسم من عرفانه از این به بغد من رو عرفان صدا بزن و شعل من توسعه نرم افزار هست",
});
history.push({
  role: "assistant",
  content: "سلام عرفان چطور میتونم کمکت کنم ؟",
});
history.push({
  role: "user",
  content: "اسم من و شغلم چیه ؟",
});
const completion = await client.chat.completions.create({
  model: process.env.OPENAI_MODEL,
  messages: history,
});

const aiResponse = completion.choices?.[0]?.message?.content;
console.log(aiResponse);
