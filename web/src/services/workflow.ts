import mongoose from "mongoose";

const WorkflowSchema = new mongoose.Schema({
    name: String,

    trigger: {
        type: String,
        required: true,
    },

    action: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        default: "active",
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Workflow =
    mongoose.models.Workflow ||
    mongoose.model("Workflow", WorkflowSchema);