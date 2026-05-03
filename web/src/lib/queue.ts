import { Queue } from "bullmq";
import { redis } from "./redis";

export const workflowQueue = new Queue("workflow-queue", {
    connection: redis,
});