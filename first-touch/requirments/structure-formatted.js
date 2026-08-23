import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: process.env.OPENAI_ENDPOINT,
  apiKey: process.env.OPENAI_API_KEY,
});

const completion = await client.chat.completions.create({
  model: process.env.OPENAI_MODEL,
  messages: [
    {
      role: "system",
      content: `
            You are an API, Always answer only valid JSON, extract user data and export it in valid JSON.
            Example: 
            {
                "name": "",
                "age": 0,
                "job": ""
            }
            `,
    },
    {
      role: "user",
      content: "عرفان یوسفی، ۲۹ سالمه و برنامه نویس بک اند هستم",
    },
  ],
});

const aiResponse = completion.choices?.[0]?.message?.content;
try {
  const user = JSON.parse(aiResponse);
  console.log(user);
  console.log(user.name);
  console.log(user.age);
  console.log(user.job);
} catch (error) {
  console.log(error);
}
