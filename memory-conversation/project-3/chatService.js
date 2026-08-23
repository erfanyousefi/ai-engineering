import {ChatOpenAI} from "@langchain/openai";
import {appendMessage, loadHistory} from "./memory.js";

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  temperature: 0.7,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  },
});

export async function chat(sessionId, userMessage) {
  const {messages: recentMessages, summary} = await loadHistory(sessionId);
  
  const systemPrompt =
    "تو یک دستیار فنی هستی که قراره همیشه با زبان فارسی و کوتاه و مختصر به سوالات و مشکلات پاسخ بدی";

  const systemContent = summary
    ? `${systemPrompt}\n خلاصه ی مکالمه ی قبلی: ${summary}`
    : systemPrompt;

  const messages = [
    {role: "system", content: systemContent},
    ...recentMessages,
    {role: "user", content: userMessage},
  ];
  const response = await model.invoke(messages);
  const reply = response.content;

  await appendMessage(sessionId, "user", userMessage);
  await appendMessage(sessionId, "assistant", reply);

  return reply;
}
