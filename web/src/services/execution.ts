import mongoose from "mongoose";

const ExecutionSchema =
    new mongoose.Schema(
        {
            userId: {
                type: String,
                required: true,
            },

            workflowId: {
                type: String,
                required: true,
            },

            status: {
                type: String,
                required: true,
            },

            log: {
                type: String,
                required: true,
            },
        },
        {
            timestamps: true,
        }
    );

export const Execution =
    mongoose.models.Execution ||
    mongoose.model(
        "Execution",
        ExecutionSchema
    );