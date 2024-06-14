import {getCharge} from "$lib/server/db/dbComposables";

/**
 * @openapi
 * /api/requests/charge:
 *   get:
 *     summary: Get charge for a user
 *     parameters:
 *       - in: header
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
 *               $ref: '#/components/schemas/Charge'
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
export const GET = async ({ request }) => {
    const userId = request.headers.get('id');
    if (userId) {
        const charge = await getCharge(userId);
        if (charge != null) {
            return new Response(JSON.stringify(charge), { status: 201 });
        }
    }
    return new Response(JSON.stringify({ message: "Failed" }), { status: 400 });
};