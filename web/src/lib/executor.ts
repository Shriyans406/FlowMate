import { Workflow } from "@/services/workflow";
import { Execution } from "@/services/execution";

export async function runWorkflow(trigger: string, payload: any) {
    console.log("RUN WORKFLOW:", trigger);

    const workflows = await Workflow.find({ trigger });

    for (const wf of workflows) {
        let status = "success";
        let log = "";

        try {
            console.log("Executing workflow:", wf.name);

            // STEP 1: simulate action
            if (wf.action === "send_slack") {
                console.log("Sending Slack message...");
                log = "Slack message sent successfully";
            }

            if (wf.action === "send_email") {
                console.log("Sending Email...");
                log = "Email sent successfully";
            }

            // simulate random failure (for testing)
            if (Math.random() < 0.3) {
                throw new Error("Random failure occurred");
            }

        } catch (err: any) {
            console.error("Execution error:", err.message);

            status = "failed";
            log = err.message;
        }

        // SAVE execution
        await Execution.create({
            workflowId: wf._id,
            status,
            log,
        });
    }
}