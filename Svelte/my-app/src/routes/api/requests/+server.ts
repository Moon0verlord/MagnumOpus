// @ts-ignore
import { requestPort } from '$lib/server/db/dbComposables';

// @ts-ignore
export const POST = async ({request}) => {
    const body = await request.json();

    const port = await requestPort(body.fromUserId, body.priority, body.requestedPortId, body.message);

    if (port === 1) {
        return new Response(JSON.stringify({message: "Success"}), {status: 201})
    } else if (port === 2) {
        return new Response(JSON.stringify({message: "Already requested"}), {status: 202})
    }

    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}