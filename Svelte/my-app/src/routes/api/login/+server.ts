import { loginUser } from "$lib/server/db/dbComposables";

// @ts-ignore
export const POST = async ({ request }) => {
    const body = await request.json();

    const user = await loginUser(body.email, body.password);

    if (user) {
        return new Response(JSON.stringify({ message: "Success", uuid: `${user.userId}`}), { status: 201 })
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}