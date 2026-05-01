import axios from "axios";

export async function generateWorkflow(prompt: string) {
    const fullPrompt = `
Convert this instruction into JSON.

Instruction:
"${prompt}"

Output ONLY JSON like this:
{
  "name": "...",
  "trigger": "...",
  "action": "..."
}

Rules:
- shopify → trigger = shopify_order
- slack/message → action = send_slack
- email → action = send_email
`;

    const response = await axios.post("http://localhost:11434/api/generate", {
        model: "llama3",
        prompt: fullPrompt,
        stream: false,
    });

    const text = response.data.response;

    console.log("RAW AI:", text);

    // Extract JSON safely
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;

    const jsonString = text.slice(jsonStart, jsonEnd);

    return JSON.parse(jsonString);
}