import {allOccupiedPorts} from "$lib/server/db/dbComposables";

/**
 * @openapi
 * /api/ports/allOccupiedPorts:
 *   get:
 *     summary: Get all occupied ports
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
export const GET = async () => {
    const port = await allOccupiedPorts();
    if (port) {
        return new Response(JSON.stringify(port), {status: 201})
    }
    return new Response(JSON.stringify({message: "Failed"}), {status: 400})
}