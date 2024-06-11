import {acceptRequest} from "$lib/server/db/dbComposables";

/**
 * @openapi
 * /api/requests/acceptRequest:
 *   post:
 *     summary: Accept a request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromUserId:
 *                 type: string
 *               requestedPortId:
 *                 type: string
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
export const POST = async ({request}) => {
    const body = await request.json();

    const requests = await acceptRequest(body.fromUserId, body.requestedPortId);

    if (requests) {
        return new Response(JSON.stringify(requests), {status: 201})
    }

    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}