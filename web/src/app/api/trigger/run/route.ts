import { connectDB } from "@/lib/db";
import { workflowQueue } from "@/lib/queue";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        console.log("ADDING JOB TO QUEUE");

        await workflowQueue.add("run-workflow", {
            trigger: body.trigger,
            payload: body,
        });

        return new Response(
            JSON.stringify({ message: "Job added to queue" }),
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