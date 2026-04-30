import { connectDB } from "@/lib/db";
import { Workflow } from "@/services/workflow";

export async function POST(req: Request) {
    await connectDB();

    const body = await req.json();

    const workflow = await Workflow.create({
        name: body.name,
        trigger: body.trigger,
        action: body.action,
    });

    return new Response(JSON.stringify(workflow), { status: 200 });
}