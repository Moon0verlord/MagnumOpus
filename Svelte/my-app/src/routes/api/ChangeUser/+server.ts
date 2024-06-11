import {ChangeUser} from "$lib/server/db/dbComposables";

export const POST = async ({ request }) => {
    const body = await request.json();
    const email = body.email;
    const name = body.name;
    const id = body.id;
    const user = await ChangeUser(id, email, name);
    if (user) {
        return new Response(JSON.stringify({ message: "Success"}), { status: 201 })
    }
    return new Response(JSON.stringify({ message: "Nothing to update"}), { status: 400 })
}