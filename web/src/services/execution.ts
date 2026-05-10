import mongoose from "mongoose";

const ExecutionSchema = new mongoose.Schema(
    {
        workflowId: {
            type: String,
            required: true,
        },

        userId: {
            type: String,
            default: "unknown",
        },

        status: {
            type: String,
            enum: ["running", "success", "failed"],
            default: "running",
        },

        log: {
            type: String,
            default: "",
        },

        startedAt: {
            type: Date,
            default: Date.now,
        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const Execution =
    mongoose.models.Execution ||
    mongoose.model("Execution", ExecutionSchema);