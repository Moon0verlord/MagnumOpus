import {ChangeUserXp} from "$lib/server/db/dbComposables";

/**
 * @openapi
 * /api/userExperience:
 *   post:
 *     summary: Change user experience
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               xp:
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
 */
// @ts-ignore
export const POST = async ({ request }) => {
    const body = await request.json();
    ChangeUserXp(body.email, body.xp);
    return new Response(JSON.stringify({ message: "Success"}), { status: 201 })
}