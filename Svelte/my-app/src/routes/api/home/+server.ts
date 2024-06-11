import { PostOktauser, GetUserByEmail} from "$lib/server/db/dbComposables";

/**
 * @openapi
 * /api/home:
 *   post:
 *     summary: Post Okta user
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
 *               oktaId:
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

    const user = await PostOktauser(body.name, body.email, body.oktaId);

    if (user && user.userId) {
        return new Response(JSON.stringify({ message: "Success", uuid: `${user.userId}`}), { status: 201 })
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}

/**
 * @openapi
 * /api/home:
 *   get:
 *     summary: Get user by email
 *     parameters:
 *       - in: header
 *         name: email
 *         schema:
 *           type: string
 *         required: true
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
 *                 email:
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
export const GET = async ({ request }) => {
    const email = request.headers.get('email');

    if (email) {
        const user = await GetUserByEmail(email);
        console.log(user);
        if (user && user[0]) {
            return new Response(JSON.stringify({message: "Success", email: `${user[0].email}`}), {status: 201})
        }
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}