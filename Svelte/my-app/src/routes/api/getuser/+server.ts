import {ChangeUserLevel, getCurUser, GetUserByEmail, PostOktauser, PostUser} from "$lib/server/db/dbComposables";

// @ts-ignore
export const GET = async ({ request }) => {
    const id = new URL(request.url) .searchParams.get("id");
    const user = await getCurUser(id);
    if (user) {
        console.log(user);
        return new Response(JSON.stringify(user), { status: 200 });
    } else {
        return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
    }
}
export const POST = async ({ request }) => {
    try {
        const body = await request.json();
        await ChangeUserLevel(body.email, body.level,body.xp);
        return new Response(JSON.stringify({ message: `Success`}), { status: 201 })
    } catch (error) {
        console.error(error);
    }
    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}
