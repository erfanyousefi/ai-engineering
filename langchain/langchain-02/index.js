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
    `اطلاعات این متن رو در قالب JSON با فیلد های زیر برگردون بدون هیچ توضیح اضافه ای
    - name: نام شخص
    - age: سن به صورت عددی
    - job: شغل
  `,
  ],
  ["human", "{text}"],
]);

const chain = prompt.pipe(model);
const text = "من عرفان یوسفی هستم ۳۰ سالمه برنامه نویس و توسعه دهنده ی بک اند هستم";

const response = await chain.invoke({text});

console.log(response.content);

try {
  console.log(JSON.parse(response.content));
} catch (error) {
  console.log(error);
}
