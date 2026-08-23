import {StringOutputParser} from "@langchain/core/output_parsers";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {RunnableSequence} from "@langchain/core/runnables";
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

const ideaPrompt = ChatPromptTemplate.fromTemplate(
  "یک ایده کسب و کار خلاقانه در حوزه {industry} پیشنهاد بده. فقط عنوان ایده  به همراه یک توضیح یک خطی کافیه",
);

const analysisPrompt = ChatPromptTemplate.fromTemplate(`
    این ایده رو در ۳ خط تحلیل کن: 
    - بازار هدف
    - چالش اصلی
    - مزیت رقابتی

    ایده: 
    {idea}`);

const stringParser = new StringOutputParser();

const ideaChain = ideaPrompt.pipe(model).pipe(stringParser);
const analysisChain = analysisPrompt.pipe(model).pipe(stringParser);

const fullChain = RunnableSequence.from([{idea: ideaChain}, analysisChain]);

const result1 = await fullChain.invoke({industry: "غذا و آشپزی"});
const result2 = await fullChain.invoke({industry: "برنامه نویسی و هوش مصنوعی"});

console.log(await ideaChain.invoke({industry: "غذا و آشپزی"}));
console.log(await ideaChain.invoke({industry: "برنامه نویسی و هوش مصنوعی"}));

// console.log(result1);
// console.log("--------------------------------");
// console.log(result2);
