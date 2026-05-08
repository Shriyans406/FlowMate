import { connectDB } from "@/lib/db";
import { Execution } from "@/services/execution";

export async function GET(req: Request) {
    await connectDB();

    const { searchParams } =
        new URL(req.url);

    const userId =
        searchParams.get("userId");

    const total =
        await Execution.countDocuments({
            userId,
        });

    const success =
        await Execution.countDocuments({
            userId,
            status: "success",
        });

    const failed =
        await Execution.countDocuments({
            userId,
            status: "failed",
        });

    return Response.json({
        total,
        success,
        failed,
    });
}