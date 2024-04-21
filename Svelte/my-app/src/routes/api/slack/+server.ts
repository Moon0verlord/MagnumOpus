import {SLACK_WEBHOOK} from "$env/static/private";

// @ts-ignore
export const POST = async ({ request }) => {
    const body = await request.json();
    const response = await fetch(SLACK_WEBHOOK, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: body.message,
        }),
    });
    if (response.ok) {
        return new Response(JSON.stringify({ message: "Success"}), { status: 201 });
    }
    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 });
}