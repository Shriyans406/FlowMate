import { connectDB } from "@/lib/db";
import { Workflow } from "@/services/workflow";

export async function GET(req: Request) {
    await connectDB();

    const { searchParams } =
        new URL(req.url);

    const userId =
        searchParams.get("userId");

    const workflows =
        await Workflow.find({
            userId,
        });

    return Response.json(workflows);
}