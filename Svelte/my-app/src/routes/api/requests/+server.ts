import {requestPort, myRequests} from '$lib/server/db/dbComposables';

/**
 * @openapi
 * /api/requests:
 *   post:
 *     summary: Request a port
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               priority:
 *                 type: string
 *               requestedPortId:
 *                 type: string
 *               message:
 *                 type: string
 *               percent:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       202:
 *         description: Already requested
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
    const port = await requestPort(body.id, body.priority, body.requestedPortId, body.message, body.percent);
    if (port === 1) {
        return new Response(JSON.stringify({message: "Success"}), {status: 201})
    } else if (port === 2) {
        return new Response(JSON.stringify({message: "Already requested"}), {status: 202})
    }

    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}

/**
 * @openapi
 * /api/requests:
 *   get:
 *     summary: Get my requests
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
        const ports = await myRequests(id);

        if (ports) {
            return new Response(JSON.stringify(ports), {status: 201})
        }
    }

    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}