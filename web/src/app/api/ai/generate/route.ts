import { generateWorkflow } from "@/app/api/ai";
import { connectDB } from "@/lib/db";
import { Workflow } from "@/services/workflow";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const prompt = body.prompt;

        console.log("AI PROMPT:", prompt);

        const workflow = await generateWorkflow(prompt);

        console.log("AI OUTPUT:", workflow);

        const saved = await Workflow.create(workflow);

        return new Response(JSON.stringify(saved), { status: 200 });
    } catch (err: any) {
        console.error(err);

        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500 }
        );
    }
}