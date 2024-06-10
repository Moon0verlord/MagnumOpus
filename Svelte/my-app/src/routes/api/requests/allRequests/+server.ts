import {allRequests} from "$lib/server/db/dbComposables";

/**
 * @openapi
 * /api/requests/allRequests:
 *   get:
 *     summary: Get all requests
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
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
    const requests = await allRequests();
    if (requests) {
        return new Response(JSON.stringify(requests), {status: 201})
    }
    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}