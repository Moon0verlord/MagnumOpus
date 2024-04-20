import { cancelRequest } from "$lib/server/db/dbComposables";

export const POST = async ({request}) => {
    const body = await request.json();

    const requests = await cancelRequest(body.requestId);

    if (requests) {
        return new Response(JSON.stringify(requests), {status: 201})
    }

    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}