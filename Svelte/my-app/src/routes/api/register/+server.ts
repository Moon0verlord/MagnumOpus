import { postUser } from "$lib/server/db";

// @ts-ignore
export const POST = async ({ request }) => {
    const body = await request.json();

    const response = postUser(body.name, body.email, body.password);

    if (response != null) {
        return new Response(JSON.stringify({ message: "Success"}), { status: 201 })
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}