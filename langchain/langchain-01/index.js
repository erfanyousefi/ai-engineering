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

console.log("مدل اماده ارسال درخواست است");

const response = await model.invoke("سلام خودت رو در یک جمله معرفی کن");
console.log("پاسخ مدل: ");
console.log(response.content);

console.log("model: ",response?.response_metadata?.model_name);
console.log("Tokens: ", response?.response_metadata?.tokenUsage);



