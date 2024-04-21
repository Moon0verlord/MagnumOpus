import {allRequests} from "$lib/server/db/dbComposables";

export const GET = async ({request}) => {

    const requests = await allRequests();

    if (requests) {
        return new Response(JSON.stringify(requests), {status: 201})
    }

    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}