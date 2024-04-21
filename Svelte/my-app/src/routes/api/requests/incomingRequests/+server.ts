import {incomingRequests} from '$lib/server/db/dbComposables';

export const GET = async ({request}) => {
    const id = new URL(request.url).searchParams.get("id");

    if (id) {
        const requests = await incomingRequests(id);

        if (requests) {
            return new Response(JSON.stringify(requests), {status: 201})
        }
    }

    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}