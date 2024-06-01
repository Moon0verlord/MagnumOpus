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


// @ts-ignore
export const GET = async ({ request }) => {
    const email = request.headers.get('email');

    if (email) {
        const user = await GetUserByEmail(email);
        console.log(user);
        if (user && user[0]) {
            return new Response(JSON.stringify({message: "Success", email: `${user[0].email}`}), {status: 201})
        }
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}