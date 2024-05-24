import type {User} from "$lib/server/db/schema";
import {GetCars, GetUserAdminStatus, GetUserByEmail} from "$lib/server/db/dbComposables";

// @ts-ignore
export const POST = async ({ request }) => {
    const body = await request.json();
    //yeah ik this is temporary
    let users: User[] = await GetUserAdminStatus(body.userId)
    const user: User = users.pop()!
    return new Response(JSON.stringify({ message: "Success", user: user}), { status: 201 })
};

// @ts-ignore
export const GET = async ({ request }) => {
    const email = request.headers.get('email');
    if (email) {
        const user = await GetUserByEmail(email);
        if (user && user[0]) {
            return new Response(JSON.stringify({ message: "Success", uuid: `${user[0].userId}`}), { status: 201 })
        }
    }
    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}
