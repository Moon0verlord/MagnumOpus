import { releasePort } from "$lib/server/db/dbComposables";

// @ts-ignore
export const POST = async ({ request }) => {
    const body = await request.json();

    const port = await releasePort(body.portId, body.stationId);

    if (port) {
        return new Response(JSON.stringify({ message: "Success"}), { status: 201 })
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}