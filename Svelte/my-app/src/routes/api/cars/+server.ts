import {GetCars, PostCar} from "$lib/server/db/dbComposables";

// @ts-ignore
export const GET = async ({request}) => {
    let cars = await GetCars();
   if(cars){
       console.log("Cars GET: Success");
   }
    return new Response(JSON.stringify(cars));
}
// @ts-ignore
export const POST = async ({request}) => {
    const body = await request.json();
    console.log("POST:"+body.car+" "+body.userId+" "+body.batteryCurrent)
    let post= await PostCar(body.car, body.userId,body.batteryCurrent);
    if(post){
        return  new Response(JSON.stringify({message: "Success"}), {status: 200});
    }
    else {  
        return  new Response(JSON.stringify({message: "Failed"}), {status: 400});
    }
}