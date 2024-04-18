import { getCurUser } from "$lib/server/db/dbComposables";

// @ts-ignore
export const GET = async ({ request }) => {
    const urlParams = new URLSearchParams(request.url.split("?")[1]);
    const id = urlParams.get("id");
    var user = await getCurUser(id);
    if (user) {
        return new Response(JSON.stringify(user), { status: 200 });
    } else {
        return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
    }
}