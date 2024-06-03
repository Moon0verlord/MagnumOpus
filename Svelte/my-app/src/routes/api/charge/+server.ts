import {GetCars, getCharge, GetEndTimeChargeEstimation, GetInterCharge} from "$lib/server/db/dbComposables";

export const GET = async ({request}) => {
    try {
        const currentCharge = request.headers.get('currentCharge');
        const maxCharge = request.headers.get('maxCharge');
        const uId = request.headers.get('userId');
        if (currentCharge && maxCharge && uId) {
            const data = await GetInterCharge(uId, currentCharge, maxCharge);
         
            return new Response(JSON.stringify(data), {status: 200});
        }
    }
    catch(e){
        return new Response(JSON.stringify({message: "Failed"}), {status: 400});
    }
  

    
    
}