import type { RequestHandler } from '@sveltejs/kit';
import {GetUserAdminStatus} from "$lib/server/db/dbComposables";
import type {User} from "$lib/server/db/schema";

// obviously unsafe with automatically inferring userId in body etc etc but we can manage.
// @ts-ignore
export const POST = async ({ request }) => {
    const body = await request.json();
    let userIsAdmin: User[] = await GetUserAdminStatus(body.userId)
    const status = userIsAdmin.pop()?.isAdmin
    return new Response(JSON.stringify({ message: "Success", isAdmin: (status == null || false ? false : status )}), { status: 201 })
};