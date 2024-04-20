import type {User} from "$lib/server/db/schema";
import {GetUserAdminStatus} from "$lib/server/db/dbComposables";

// @ts-ignore
export const POST = async ({ request }) => {
    const body = await request.json();
    //yeah ik this is temporary
    let users: User[] = await GetUserAdminStatus(body.userId)
    const user: User = users.pop()!
    return new Response(JSON.stringify({ message: "Success", user: user}), { status: 201 })
};