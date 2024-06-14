import { PostUser } from '$lib/server/db/dbComposables';
import { json } from '@sveltejs/kit';
import { GetUserByEmail } from '$lib/server/db/dbComposables';


/**
 * @openapi
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
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
    try {
        const body = await request.json();

        const result = await PostUser(body.name, body.email, body.password);

        if (result) {
            return new Response(JSON.stringify({ message: "Success"}), { status: 201 })
        }
    } catch (error) {
        console.error(error);
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}

