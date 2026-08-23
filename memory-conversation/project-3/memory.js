import {ChatOpenAI} from "@langchain/openai";
import {redis} from "./redisClient.js";

const TTL_SECONDS = 3600;

const summaryModel = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  },
});

const historyKey = (sessionId) => `chat:history:${sessionId}`;
const summaryKey = (sessionId) => `chat:summary:${sessionId}`;

export async function loadHistory(sessionId) {
  const rawList = await redis.lRange(historyKey(sessionId), 0, -1);
  const summary = await redis.get(summaryKey(sessionId));
  const messages = rawList?.map((msg) => JSON.parse(msg));
  return {
    messages,
    summary,
  };
}

export async function appendMessage(sessionId, role, content) {
  await redis.rPush(historyKey(sessionId), JSON.stringify({role, content}));
  await redis.expire(historyKey(sessionId), TTL_SECONDS);
  await redis.expire(summaryKey(sessionId), TTL_SECONDS);

  await maybeSummarize(sessionId);
}

export async function clearHistory(sessionId) {
  await redis.del(historyKey(sessionId));
  await redis.del(summaryKey(sessionId));
}

async function maybeSummarize(sessionId) {
  const totalMessages = await redis.lLen(historyKey(sessionId));

  if (totalMessages <= 8) return;

  const allMessages = (await redis.lRange(historyKey(sessionId), 0, -1)).map((m) => JSON.parse(m));

  const oldMessages = allMessages.slice(0, -2);
  const recentMessages = allMessages.slice(-2);
  console.log(recentMessages);

  const previousSummary = (await redis.get(summaryKey(sessionId))) || "";
  const oldMessagesText = oldMessages.map((m) => `${m.role}: ${m.content}`).join("\n");

  const summarizationPrompt = previousSummary
    ? `خلاصه ی قبلی گفتگو: ${previousSummary}\n
  پیام های جدیدتر: ${oldMessagesText}\n
  حالا این هارا در چند جمله کوتاه ادغام و خلاصه سازی کن نکات مهم را نیز حفظ کن
  `
    : `این بخش از یک مکالمه را در چند جمله کوتاه خلاصه کن تا نکات مهمش حفظ بشه: \n
    ${oldMessagesText}`;

  const summaryResponse = await summaryModel.invoke(summarizationPrompt);
  const newSummary = summaryResponse.content;
  console.log(newSummary);

  await redis.del(historyKey(sessionId));
  for (const message of recentMessages) {
    await redis.rPush(historyKey(sessionId), JSON.stringify(message));
  }

  await redis.set(summaryKey(sessionId), newSummary,{
    expiration: {type: "EX", value: TTL_SECONDS},
  });
  await redis.expire(historyKey(sessionId), TTL_SECONDS);

  console.log(` Session ${sessionId}: ${oldMessages.length} پیام قدیمی خلاصه سازی شد`);
}
