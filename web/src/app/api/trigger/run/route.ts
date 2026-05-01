import { connectDB } from "@/lib/db";
import { runWorkflow } from "@/lib/executor";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const trigger = body.trigger;

        console.log("TRIGGER RECEIVED:", trigger);

        await runWorkflow(trigger, body);

        return new Response(
            JSON.stringify({ message: "Workflow executed" }),
            { status: 200 }
        );
    } catch (err: any) {
        console.error(err);

        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500 }
        );
    }
}