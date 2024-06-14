import { reservePort } from "$lib/server/db/dbComposables";


/**
 * @openapi
 * /api/stations:
 *   post:
 *     summary: Reserve a port
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
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
 *       202:
 *         description: User has already reserved a port
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

    const port = await reservePort(body.userId, body.portId, body.stationId);
    if (port) {
        if (port === "User has already reserved a port") {
            return new Response(JSON.stringify({ message: "User has already reserved a port"}), { status: 202 });
        }

        return new Response(JSON.stringify({ message: "Success"}), { status: 201 })
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}