import {GetCars, getCharge, GetEndTimeChargeEstimation, GetInterCharge, PostCharge} from "$lib/server/db/dbComposables";

// @ts-ignore
export const GET = async ({request}) => {
    try {
        const currentCharge = request.headers.get('currentCharge');
        const maxCharge = request.headers.get('maxCharge');
        const uId = request.headers.get('userId');
        if (currentCharge && maxCharge && uId) {
            const data = await GetInterCharge(uId, currentCharge, maxCharge);

            return new Response(JSON.stringify({charge: data}), {status: 200});
        }
    } catch (e) {
        return new Response(JSON.stringify({message: "Failed"}), {status: 400});
    }
}

// @ts-ignore
export const POST = async ({ request }) => {
    try {
        const body = await request.json()
        let charge = body.charge;
        let userId = body.userId
        if ((charge !== null && charge) && userId !== null) {
            await PostCharge(userId, charge);
            return new Response(JSON.stringify({message: "Success"}), {status: 200});
        }
        return new Response(JSON.stringify({message: "Failed. Charge or userId were null."}), {status: 400});
    }
    catch (error)
    {
        console.error(error);
        return new Response(JSON.stringify({message: "Failed"}), {status: 500});
    }
}

    
    
