import { loginUser } from "$lib/server/db/dbComposables";

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Check Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
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
 *                 uuid:
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
    const user = await loginUser(body.email, body.password);
    if (user) {
        return new Response(JSON.stringify({ message: "Success", uuid: `${user.userId}`}), { status: 201 })
    }
    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}