import mongoose from "mongoose";

const WorkflowSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        trigger: {
            type: String,
            required: true,
        },

        action: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Workflow =
    mongoose.models.Workflow ||
    mongoose.model(
        "Workflow",
        WorkflowSchema
    );