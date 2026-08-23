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
  ["system", "تو یک متخصص {field} هستی "],
  ["human", "در ۲ جمله توضیح بده: {question}"],
]);
const parser = new StringOutputParser();
const chain = prompt.pipe(model).pipe(parser);

console.log("ورودی -> prompt(تکمیل میشه) -> model (فکر میکنه) -> parser(خروجی مناسب تحویل میده)");

const result = await chain.invoke({
  field: "شبکه عای کامپیوتری",
  question: "TCP/IP چیه؟",
});

console.log(result);
