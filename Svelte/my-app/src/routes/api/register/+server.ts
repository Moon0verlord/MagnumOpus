import { postUser } from "$lib/server/db";

export const POST = async ({ request }) => {
    const body = await request.json();

    const response = postUser(body.userName, body.userEmail, body.userPassword);

    if (response != null) {
        return new Response(JSON.stringify({ message: "Success"}), { status: 201 })
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}