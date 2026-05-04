import { connectDB } from "@/lib/db";
import { Execution } from "@/services/execution";

export async function GET() {
    await connectDB();

    const executions = await Execution.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify(executions), {
        status: 200,
    });
}