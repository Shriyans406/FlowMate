export async function sendSlackMessage(message: string) {
    const webhook = process.env.SLACK_WEBHOOK_URL!;

    const res = await fetch(webhook, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: message,
        }),
    });

    if (!res.ok) {
        throw new Error("Slack message failed");
    }

    return "Slack message sent successfully";
}