import {GetCars, getCharge, GetEndTimeChargeEstimation, GetInterCharge} from "$lib/server/db/dbComposables";

export const GET = async ({request}) => {
    const currentCharge = request.headers.get('currentCharge');
    const maxCharge = request.headers.get('maxCharge');
    const uId = request.headers.get('userId');
    console.log("GET charge/server.ts:"+currentCharge+" "+maxCharge+" "+uId)
    if(currentCharge && maxCharge && uId) {
        return new Response(JSON.stringify(await GetInterCharge(currentCharge, maxCharge, uId)));
    }
    return new Response(JSON.stringify({message: "Failed"}), {status: 400});
    
    
}