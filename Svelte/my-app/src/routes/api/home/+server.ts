import { PostOktauser } from "$lib/server/db/dbComposables";
import { GetUserByEmail } from "$lib/server/db/dbComposables";
// @ts-ignore

export const POST = async ({ request }) => {
    const body = await request.json();

    const user = await PostOktauser(body.name, body.email, body.oktaId);

    if (user && user.userId) {
        return new Response(JSON.stringify({ message: "Success", uuid: `${user.userId}`}), { status: 201 })
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}


export const GET = async ({ request }) => {
    const body = await request.json();

    const user = await GetUserByEmail(body.email);

    if (user && user[0]) {
        return new Response(JSON.stringify({ message: "Success", uuid: `${user[0].userId}`}), { status: 201 })
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}