import {GetCars, PostCar} from "$lib/server/db/dbComposables";

/**
 * @openapi
 * /api/cars:
 *   get:
 *     summary: Get all cars
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 */
// @ts-ignore
export const GET = async ({request}) => {
    let cars = await GetCars();
    return new Response(JSON.stringify(cars));
}

/**
 * @openapi
 * /api/cars:
 *   post:
 *     summary: Post a car
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               car:
 *                 type: string
 *               userId:
 *                 type: string
 *               batteryCurrent:
 *                 type: number
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// @ts-ignore
export const POST = async ({request}) => {
    const body = await request.json();
    let post= await PostCar(body.car, body.userId,body.batteryCurrent);
    if(post){
        return  new Response(JSON.stringify({message: "Success"}), {status: 200});
    }
    else {
        return  new Response(JSON.stringify({message: "Failed"}), {status: 400});
    }
}