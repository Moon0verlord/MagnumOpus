import {ChangeUserLevel, getCurUser} from "$lib/server/db/dbComposables";

/**
 * @openapi
 * /api/getuser:
 *   get:
 *     summary: Get current user
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
    const id = new URL(request.url) .searchParams.get("id");
    const user = await getCurUser(id);
    if (user) {
        console.log(user);
        return new Response(JSON.stringify(user), { status: 200 });
    } else {
        return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
    }
}

/**
 * @openapi
 * /api/getuser:
 *   post:
 *     summary: Change user level
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               level:
 *                 type: integer
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
        await ChangeUserLevel(body.email, body.level,body.xp);
        return new Response(JSON.stringify({ message: `Success`}), { status: 201 })
    } catch (error) {
        console.error(error);
    }
    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}