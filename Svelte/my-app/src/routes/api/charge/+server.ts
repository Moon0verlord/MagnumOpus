import {GetInterCharge, PostCharge} from "$lib/server/db/dbComposables";

/**
 * @openapi
 * /api/charge:
 *   get:
 *     summary: Get intermediate charge
 *     parameters:
 *       - in: header
 *         name: currentCharge
 *         schema:
 *           type: string
 *         required: true
 *       - in: header
 *         name: maxCharge
 *         schema:
 *           type: string
 *         required: true
 *       - in: header
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 charge:
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

/**
 * @openapi
 * /api/charge:
 *   post:
 *     summary: Post a charge
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               charge:
 *                 type: string
 *               userId:
 *                 type: string
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
 *         description: Failed. Charge or userId were null.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
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