import "dotenv/config";
import OpenAI from "openai";
import readline from "readline/promises";
const client = new OpenAI({
  baseURL: process.env.ARVANCLOUD_MODEL_ENDPOINT,
  apiKey: process.env.ARVANCLOUD_API_KEY,
});
async function agent(question) {
  const res = await client.chat.completions.create({
    model: "claude-haiku-4-5",
    max_tokens: 500,
    messages: [{role: "user", content: question}],
  });
  return res?.choices?.[0]?.message?.content;
}
async function main() {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log("Bot is ready. for exit please type <exit> ");
  while (true) {
    const question = await readlineInterface.question("You: ");
    if (question.trim() === "exit") break;
    if (!question.trim()) continue;
    try {
      const answer = await agent(question);
      console.log(`Bot: ${answer}\n`);
    } catch (error) {
      console.log(error);
    }
  }
  readlineInterface.close();
  console.log("Goodby!");
}

main();
