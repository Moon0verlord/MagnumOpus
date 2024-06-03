import {acceptRequest, getCharge} from "$lib/server/db/dbComposables";


export const GET = async ({ request }) => {

    
    const userId = request.headers.get('id');

    if (userId) {
        const charge = await getCharge(userId);

        if (charge) {
            return new Response(JSON.stringify(charge), { status: 201 });
        }
    }

    return new Response(JSON.stringify({ message: "Failed" }), { status: 400 });
};