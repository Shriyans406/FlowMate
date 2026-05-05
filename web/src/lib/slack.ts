export async function sendSlackMessage(text: string) {
    const url = process.env.SLACK_WEBHOOK_URL!;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
        }),
    });

    if (!res.ok) {
        throw new Error("Slack API failed");
    }

    return true;
}