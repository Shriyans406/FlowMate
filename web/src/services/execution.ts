import mongoose from "mongoose";

const ExecutionSchema = new mongoose.Schema({
    workflowId: String,
    status: String,
    log: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Execution =
    mongoose.models.Execution ||
    mongoose.model("Execution", ExecutionSchema);