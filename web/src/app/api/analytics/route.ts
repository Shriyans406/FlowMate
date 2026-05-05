import { connectDB } from "@/lib/db";
import { Execution } from "@/services/execution";

export async function GET() {
    await connectDB();

    const total = await Execution.countDocuments();
    const success = await Execution.countDocuments({ status: "success" });
    const failed = await Execution.countDocuments({ status: "failed" });

    return new Response(
        JSON.stringify({
            total,
            success,
            failed,
        }),
        { status: 200 }
    );
}