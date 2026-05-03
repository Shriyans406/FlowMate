import { Queue } from "bullmq";
import { redis } from "./src/lib/redis.js";

const testQueue = new Queue("workflow-queue", {
    connection: redis,
});

async function run() {
    console.log("Adding test job...");
    const job = await testQueue.add("test-job", { trigger: "test", payload: {} });
    console.log("Job added with ID:", job.id);
    process.exit(0);
}

run().catch(console.error);
