import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Load env from .env.local manually
const envFile = fs.readFileSync(".env.local", "utf-8");
for (const line of envFile.split("\n")) {
  if (line.startsWith("GEMINI_API_KEY=")) {
    process.env.GEMINI_API_KEY = line.split("=")[1].trim();
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Unfortunately the SDK doesn't expose ListModels directly easily without REST.
    // Let's do a raw fetch to ListModels
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("AVAILABLE MODELS:");
    data.models.forEach(m => console.log(m.name, m.supportedGenerationMethods));
  } catch (e) {
    console.error("Error:", e);
  }
}

run();
