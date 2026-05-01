import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment variables. Please add it to your .env.local file.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateWorkflow(prompt: string) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
    });

    const fullPrompt = `
Convert the following instruction into JSON.

Instruction:
"${prompt}"

Return ONLY JSON. No text.

Format:
{
  "name": "...",
  "trigger": "...",
  "action": "..."
}

Rules:
- If Shopify/order mentioned → trigger = "shopify_order"
- If Slack/message mentioned → action = "send_slack"
- If email mentioned → action = "send_email"
`;

    const result = await model.generateContent(fullPrompt);

    const response = await result.response;
    const text = response.text();

    console.log("RAW GEMINI:", text);

    // Extract JSON safely
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;

    const jsonString = text.slice(start, end);

    return JSON.parse(jsonString);
}