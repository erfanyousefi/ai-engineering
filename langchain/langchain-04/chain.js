import {ChatPromptTemplate} from "@langchain/core/prompts";
import {ChatOpenAI} from "@langchain/openai";
import {schema} from "./schema.js";

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  },
}).withStructuredOutput(schema);

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "تو یک تحلیلگر پیام های مشتریان هستی. با دقت متن پیام مشتری را تحلیل کن و فقط بر اساس اسکیمای داده شده پاسخ بده",
  ],
  ["human", "پیام مشتری: {message}"],
]);

export const chain = prompt.pipe(model);
