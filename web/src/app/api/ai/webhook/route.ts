import { workflowQueue } from "@/lib/queue";

export async function POST(req: Request) {
    const body = await req.json();

    console.log("Webhook received:", body);

    await workflowQueue.add("run-workflow", {
        trigger: "shopify_order",
        payload: body,
    });

    return new Response(
        JSON.stringify({ message: "Webhook received" }),
        { status: 200 }
    );
}