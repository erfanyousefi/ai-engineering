import {StringOutputParser} from "@langchain/core/output_parsers";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {RunnableParallel} from "@langchain/core/runnables";
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
const stringParser = new StringOutputParser();

const marketPrompt = ChatPromptTemplate.fromTemplate(`
  حوزه کسب و کار {industry} را در سه خط تحلیل کن: 
  - وضعیت بازار
  - میزان تقاضا
  - فرصت رشد
  `);
const customerPrompt = ChatPromptTemplate.fromTemplate(`
  برای کسب و کار در حوزه  {industry} را در سه خط مشتری هدف را مشخص کن: 
  - چه کسانی هستند
  - چه نیاز هایی دارند
  - چرا باید از این محصول استفاده کنند
  `);
const revenuePrompt = ChatPromptTemplate.fromTemplate(`
  برای کسب و کار در حوزه  {industry} را در سه خط مدل درآمدی مناسب را پیشنهاد بده: 
  - منبع درامد
  - روش های قیمت گذاری
  - پیشنهاد برای افزایش درامد
  `);

const marketChain = marketPrompt.pipe(model).pipe(stringParser);
const customerChain = customerPrompt.pipe(model).pipe(stringParser);
const revenueChain = revenuePrompt.pipe(model).pipe(stringParser);

const parallelChain = RunnableParallel.from({
  market: marketChain,
  customer: customerChain,
  revenue: revenueChain,
});

const industry = "صنایع دستی و بافندگی";

const result = await parallelChain.invoke({industry});

console.log("تحلیل بازار: ");
console.log(result.market);
console.log("مشتری هدف: ");
console.log(result.customer);
console.log("مدل درآمدی: ");
console.log(result.revenue);
