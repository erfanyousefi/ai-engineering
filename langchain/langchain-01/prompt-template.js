import {StringOutputParser} from "@langchain/core/output_parsers";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {ChatOpenAI} from "@langchain/openai";
import "dotenv/config";

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  temperature: 0.3,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  },
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "تو یک خلاصه ساز حرفه ای متن هستی خروجی رو به زبان {language} در حداکثر {maxSentences} ارائه بده",
  ],
  ["human", "متن: {text}"],
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());
const text = `Node.js یک محیط Runtime جاوااسکریپت، متن باز و چندپلتفرمی است که به توسعه‌دهندگان اجازه می‌دهد کدهای جاوااسکریپت را خارج از مرورگر وب و در سمت سرور اجرا کنند. Node.js که روی موتور جاوااسکریپت V8 کروم ساخته شده است، توسعه برنامه‌های سمت سرور را ممکن و ساده می‌کند. قابلیتی که کمبود آن، به‌شدت توسط توسعه‌دهندگان Front-end احساس می‌شد. این پلتفرم جاوااسکریپت را قادر می‌سازد تا هم برای توسعه Front-end و هم برای ساخت برنامه‌های Back-end استفاده شود. Node.js الگوی محبوب و مشهور “JavaScript Everywhere” را ترویج می‌کند.`;

console.log(await chain.invoke({text, language: "فارسی", maxSentences: 3}));
console.log(await chain.invoke({text, language: "انگلیسی", maxSentences: 2}));
