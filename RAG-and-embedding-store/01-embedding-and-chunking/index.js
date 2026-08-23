import {OpenAIEmbeddings} from "@langchain/openai";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import "dotenv/config";
import fs from "node:fs/promises";
const embeddings = new OpenAIEmbeddings({
  model: process.env.EMBEDDING_MODEL || "text-embedding-3-large",
  configuration: {
    baseURL: process.env.EMBEDDING_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  },
});

async function splitDocument() {
  const rawText = await fs.readFile("./docs/sample.txt", "utf-8");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 50,
  });

  const chunks = await splitter.splitText(rawText);
  console.log(`text converted to ${chunks.length} chunks`);
  return chunks;
}

async function embedChunks(chunks) {
  console.log("building vector data using embedding...");
  const vectors = await embeddings.embedDocuments(chunks);
  console.log("data embedded successfully.");
  return vectors;
}

function cosineSimilarity(vectorA, vectorB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    normA += vectorA[i] ** 2;
    normB += vectorB[i] ** 2;
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function findRelevantChunks(question, chunks, chunkVectors, topK = 3) {
  const [questionVector] = await embeddings.embedDocuments([question]);

  const scored = chunks.map((chunk, index) => {
    return {
      chunk,
      score: cosineSimilarity(questionVector, chunkVectors[index]),
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

async function main() {
  const chunks = await splitDocument();
  const chunkVectors = await embedChunks(chunks);

  const question = "شرایط بازگشت وجه چطوریه؟";
  const topMatches = await findRelevantChunks(question, chunks, chunkVectors);

  topMatches.forEach((item) => {
    console.log(`امتیاز شباهت: ${item.score.toFixed(2)}`);
    console.log(item.chunk);
    console.log("--------------------------------------------");
  });
}
main();
