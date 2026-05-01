import { runWorkflow } from "@/lib/executor";
import { connectDB } from "@/lib/db";

export async function GET() {
    await connectDB();

    const fakeOrder = {
        trigger: "shopify_order",
        orderId: Math.floor(Math.random() * 1000),
        price: 200,
    };

    await runWorkflow("shopify_order", fakeOrder);

    return new Response(
        JSON.stringify({ message: "Shopify test triggered" }),
        { status: 200 }
    );
}