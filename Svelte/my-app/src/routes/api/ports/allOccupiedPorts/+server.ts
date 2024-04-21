import {allOccupiedPorts} from "$lib/server/db/dbComposables";

export const GET = async () => {
    const port = await allOccupiedPorts();

    if (port) {
        return new Response(JSON.stringify(port), {status: 201})
    }

    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}