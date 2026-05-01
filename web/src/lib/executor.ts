import { Workflow } from "@/services/workflow";
import { Execution } from "@/services/execution";

export async function runWorkflow(trigger: string, payload: any) {
    console.log("RUN WORKFLOW CALLED");

    const workflows = await Workflow.find({
        trigger: trigger,
        status: "active",
    });

    console.log("FOUND WORKFLOWS:", workflows.length);

    for (const wf of workflows) {
        try {
            console.log("Executing:", wf.name);

            let result = "";

            // BASIC ACTION HANDLING
            if (wf.action === "send_email") {
                result = "Email sent (simulated)";
            } else if (wf.action === "send_slack") {
                result = "Slack message sent (simulated)";
            } else {
                result = "Unknown action";
            }

            await Execution.create({
                workflowId: wf._id,
                status: "success",
                log: result,
            });

            console.log("Execution success:", result);
        } catch (err: any) {
            console.log("Execution failed:", err.message);

            await Execution.create({
                workflowId: wf._id,
                status: "failed",
                log: err.message,
            });
        }
    }
}