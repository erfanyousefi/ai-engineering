import {ChatPromptTemplate} from "@langchain/core/prompts";
import {ChatOpenAI} from "@langchain/openai";
import "dotenv/config";
import {z} from "zod";

const personSchema = z.object({
  name: z.string().describe("نام کامل شخص"),
  age: z.number().int().positive().describe("سن به سال"),
  job: z.string().describe("شغل یا حرفه"),
  isStudent: z.boolean().describe("آیا درحال حاضر دانشجو یا دانش آموز است؟"),
});

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  temperature: 0.3,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  },
}).withStructuredOutput(personSchema);

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "از متن ورودی اطلاعات شخص رو استخراج کن"],
  ["human", "{text}"],
]);

const chain = prompt.pipe(model);
const samples = [
  "من عرفان یوسفی هستم ۳۰ سالمه برنامه نویس و توسعه دهنده ی بک اند هستم",
  "سلام اسمم محمده دانشجوی برق شریف متولد سال ۱۳۷۸ شمسی وشفلمم گارسون هست",
  "سلام دکتر علی احمدی هستم ۴۵ سالمه پزشک قلب",
  "محمد هستم ۲۸ سالمه و مهندس نرم افزار",
];
for (const sample of samples) {
  const response = await chain.invoke({text: sample});
  console.log(response);
  console.log("-----------------------------");
}
