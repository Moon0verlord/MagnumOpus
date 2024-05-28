// @ts-ignore
import {requestPort, myRequests} from '$lib/server/db/dbComposables';

// @ts-ignore
export const POST = async ({request}) => {
    const body = await request.json();
    const port = await requestPort(body.id, body.priority, body.requestedPortId, body.message,body.percent);
    if (port === 1) {
        return new Response(JSON.stringify({message: "Success"}), {status: 201})
    } else if (port === 2) {
        return new Response(JSON.stringify({message: "Already requested"}), {status: 202})
    }

    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}

export const GET = async ({request}) => {
    const id = new URL(request.url).searchParams.get("id");

    if (id) {
        const ports = await myRequests(id);

        if (ports) {
            return new Response(JSON.stringify(ports), {status: 201})
        }
    }

    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}