import { connectDB } from "@/lib/db";
import { Execution } from "@/services/execution";

export async function GET(req: Request) {
    await connectDB();

    const { searchParams } =
        new URL(req.url);

    const userId =
        searchParams.get("userId");

    const executions =
        await Execution.find({
            userId,
        });

    return Response.json(executions);
}