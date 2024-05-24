import {GetCars, PostCar} from "$lib/server/db/dbComposables";

export const GET = async ({request}) => {
    let cars = await GetCars();
   if(cars){
       console.log("Cars GET: Success");
   }
    return new Response(JSON.stringify(cars));
}
export const POST = async ({request}) => {
    const body = await request.json();
    
    let post= await PostCar(body.car, body.userId);
    
    if(post){
        return  new Response(JSON.stringify({message: "Success"}), {status: 201});
    }
    else {  
        return  new Response(JSON.stringify({message: "Failed"}), {status: 400});
    }
}