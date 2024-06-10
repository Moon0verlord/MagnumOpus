import {incomingRequests} from '$lib/server/db/dbComposables';

/**
 * @openapi
 * /api/requests/incomingRequests:
 *   get:
 *     summary: Get incoming requests for a user
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
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
    const id = new URL(request.url).searchParams.get("id");
    if (id) {
        const requests = await incomingRequests(id);
        if (requests) {
            return new Response(JSON.stringify(requests), {status: 201})
        }
    }
    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}