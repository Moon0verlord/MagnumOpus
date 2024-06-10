import {myPorts, releasePort} from "$lib/server/db/dbComposables";

/**
 * @openapi
 * /api/ports:
 *   get:
 *     summary: Get ports by user ID
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
 *               $ref: '#/components/schemas/Port'
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
        const port = await myPorts(id);

        if (port) {
            return new Response(JSON.stringify(port), {status: 201})
        }
    }

    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}

/**
 * @openapi
 * /api/ports:
 *   post:
 *     summary: Release port
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               portId:
 *                 type: string
 *               stationId:
 *                 type: string
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
export const POST = async ({ request }) => {
    const body = await request.json();

    const port = await releasePort(body.portId, body.stationId);

    if (port) {
        return new Response(JSON.stringify({ message: "Success"}), { status: 201 })
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}