import { reservePort } from "$lib/server/db/dbComposables";

// @ts-ignore
export const POST = async ({ request }) => {
    const body = await request.json();

    const port = await reservePort(body.userId, body.portId, body.stationId,body.occupiedTime);
    console.log("POST:"+body.occupiedTime)
    if (port) {
        if (port === "User has already reserved a port") {
            return new Response(JSON.stringify({ message: "User has already reserved a port"}), { status: 202 });
        }

        return new Response(JSON.stringify({ message: "Success"}), { status: 201 })
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}