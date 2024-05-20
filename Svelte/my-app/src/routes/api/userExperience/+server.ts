import {ChangeUserXp} from "$lib/server/db/dbComposables";

export const POST = async ({ request }) => {
    const body = await request.json();
    ChangeUserXp(body.email, body.xp);
    return new Response(JSON.stringify({ message: "Success"}), { status: 201 })
}