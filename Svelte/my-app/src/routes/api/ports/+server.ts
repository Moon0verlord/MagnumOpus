import {myPorts, releasePort} from "$lib/server/db/dbComposables";

export const GET = async ({request}) => {
    const id = new URL(request.url).searchParams.get("id");

    if (id) {
        const port = await myPorts(id);

        if (port) {
            return new Response(JSON.stringify(port), {status: 201})
        }
    }

    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}

export const POST = async ({ request }) => {
    const body = await request.json();

    const port = await releasePort(body.portId, body.stationId);

    if (port) {
        return new Response(JSON.stringify({ message: "Success"}), { status: 201 })
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}
