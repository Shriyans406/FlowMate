import { Workflow } from "@/services/workflow";
import { Execution } from "@/services/execution";

import { sendSlackMessage } from "./slack";

export async function runWorkflow(trigger: string, payload: any) {
    console.log("RUN WORKFLOW:", trigger);

    // FIND ALL WORKFLOWS MATCHING TRIGGER
    const workflows = await Workflow.find({ trigger });

    // LOOP THROUGH EACH WORKFLOW
    for (const wf of workflows) {

        let status = "success";
        let log = "";

        // =========================================
        // RETRY SYSTEM
        // =========================================

        let success = false;

        const MAX_RETRIES = 3;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

            try {

                console.log(
                    `Executing workflow: ${wf.name} | Attempt ${attempt}`
                );

                // =========================================
                // SLACK ACTION
                // =========================================

                if (wf.action === "send_slack") {

                    console.log("Sending Slack message...");

                    await sendSlackMessage(
                        `Workflow Triggered: ${wf.name}`
                    );

                    log = `Slack message sent successfully on attempt ${attempt}`;
                }

                // =========================================
                // EMAIL ACTION
                // =========================================

                if (wf.action === "send_email") {

                    console.log("Sending Email...");

                    log = `Email sent successfully on attempt ${attempt}`;
                }

                // =========================================
                // RANDOM FAILURE TESTING
                // =========================================
                // Uncomment if you want to test retries

                /*
                if (Math.random() < 0.5) {
                    throw new Error("Random failure occurred");
                }
                */

                // SUCCESS
                success = true;

                break;

            } catch (err: any) {

                console.error(
                    `Attempt ${attempt} failed:`,
                    err.message
                );

                status = "failed";

                log = `Attempt ${attempt} failed: ${err.message}`;

                // WAIT BEFORE RETRY
                if (attempt < MAX_RETRIES) {

                    console.log("Retrying in 2 seconds...");

                    await new Promise((resolve) =>
                        setTimeout(resolve, 2000)
                    );
                }
            }
        }

        // =========================================
        // FINAL FAILURE AFTER ALL RETRIES
        // =========================================

        if (!success) {

            status = "failed";

            log =
                "Workflow failed after 3 retry attempts";
        }

        // =========================================
        // SAVE EXECUTION
        // =========================================

        await Execution.create({

            userId: wf.userId,

            workflowId: wf._id,

            status,

            log,
        });

        console.log(
            `Execution finished: ${wf.name} | Status: ${status}`
        );
    }
}