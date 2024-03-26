import { loginUser } from "$lib/server/db";

export const POST = async ({ request }) => {
    const body = await request.json();

    const response = loginUser(body.email, body.password);

    if (response) {
        return new Response(JSON.stringify({ message: "Success"}), { status: 201 })
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}