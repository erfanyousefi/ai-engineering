import {redis} from "./redisClient.js";

const TTL_SECONDS = 3600;

const historyKey = (sessionId) => `chat:history:${sessionId}`;

export async function loadHistory(sessionId) {
  const messages = await redis.lRange(historyKey(sessionId), 0, -1);
  return messages?.map((msg) => JSON.parse(msg));
}

export async function appendMessage(sessionId, role, content) {
  await redis.rPush(historyKey(sessionId), JSON.stringify({role, content}));
  await redis.expire(historyKey(sessionId), TTL_SECONDS);
}

export async function clearHistory(sessionId) {
  await redis.del(historyKey(sessionId));
}
