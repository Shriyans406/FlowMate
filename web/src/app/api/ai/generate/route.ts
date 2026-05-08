import { generateWorkflow } from "@/app/api/ai";
import { connectDB } from "@/lib/db";
import { Workflow } from "@/services/workflow";

export async function POST(req: Request) {
    try {
        // CONNECT DATABASE
        await connectDB();

        // GET BODY
        const body = await req.json();

        // EXTRACT VALUES
        const { prompt, userId } = body;

        console.log("PROMPT:", prompt);
        console.log("USER ID:", userId);

        // GENERATE AI WORKFLOW
        const workflow = await generateWorkflow(prompt);

        console.log("AI RESULT:", workflow);

        // SAVE USER ID INSIDE WORKFLOW
        const saved = await Workflow.create({
            ...workflow,
            userId,
        });

        // RETURN RESPONSE
        return new Response(JSON.stringify(saved), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });

    } catch (err: any) {
        console.error("ERROR:", err);

        return new Response(
            JSON.stringify({
                error: err.message,
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}