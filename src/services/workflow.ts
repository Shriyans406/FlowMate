import mongoose from "mongoose";

const WorkflowSchema = new mongoose.Schema({
    name: String,
    trigger: String,
    action: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Workflow =
    mongoose.models.Workflow ||
    mongoose.model("Workflow", WorkflowSchema);