import {acceptRequest, getCharge} from "$lib/server/db/dbComposables";

export const GET = async ({request}) => {
    console.log("GET")
    const body = await request.json();
    const charge = await getCharge(body.id);

    if (charge) {
        return new Response(JSON.stringify(charge), {status: 201})
    }

    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}