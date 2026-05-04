import { connectDB } from "@/lib/db";
import { Workflow } from "@/services/workflow";

export async function GET() {
    await connectDB();

    const workflows = await Workflow.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify(workflows), {
        status: 200,
    });
}