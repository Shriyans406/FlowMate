import { connectDB } from "@/lib/db";
import { Workflow } from "@/services/workflow";

export async function POST(req: Request) {
    try {
        console.log("API HIT");

        await connectDB();
        console.log("DB CONNECTED");

        const body = await req.json();
        console.log("BODY:", body);

        const workflow = await Workflow.create({
            name: body.name,
            trigger: body.trigger,
            action: body.action,
        });

        console.log("WORKFLOW SAVED");

        return new Response(JSON.stringify(workflow), { status: 200 });
    } catch (error: any) {
        console.error("ERROR:", error);

        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}