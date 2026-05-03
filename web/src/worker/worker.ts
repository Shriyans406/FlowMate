import { Worker } from "bullmq";
import { redis } from "../lib/redis.js";
import { runWorkflow } from "../lib/executor.js";
import { connectDB } from "../lib/db.js";
const worker = new Worker(
    "workflow-queue",
    async (job) => {
        console.log("JOB RECEIVED:", job.data);

        await connectDB();

        await runWorkflow(job.data.trigger, job.data.payload);
    },
    {
        connection: redis,
    }
);

worker.on("completed", () => {
    console.log("JOB COMPLETED");
});

worker.on("failed", (job, err) => {
    console.log("JOB FAILED:", err.message);
});