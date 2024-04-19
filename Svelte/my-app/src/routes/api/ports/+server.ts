import {myPorts, releasePort} from "$lib/server/db/dbComposables";

export const POST = async ({request}) => {
    const body = await request.json();

    const port = await myPorts(body.userId);

    if (port) {
        return new Response(JSON.stringify(port), {status: 201})
    }

    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}
