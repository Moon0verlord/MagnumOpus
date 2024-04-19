import { getCurUser } from "$lib/server/db/dbComposables";

// @ts-ignore
export const GET = async ({ request }) => {
    const id = new URL(request.url) .searchParams.get("id");
    var user = await getCurUser(id);
    if (user) {
        console.log(user);
        return new Response(JSON.stringify(user), { status: 200 });
    } else {
        return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
    }
}