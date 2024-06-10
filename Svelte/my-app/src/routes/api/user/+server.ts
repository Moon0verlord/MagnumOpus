import type {User} from "$lib/server/db/schema";
import {GetCars, GetUserAdminStatus, GetUserByEmail} from "$lib/server/db/dbComposables";

/**
 * @openapi
 * /api/user:
 *   post:
 *     summary: Update user admin status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
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
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
// @ts-ignore
export const POST = async ({ request }) => {
    const body = await request.json();
    let users: User[] = await GetUserAdminStatus(body.userId)
    const user: User = users.pop()!
    return new Response(JSON.stringify( { message: "Success", user: user}), { status: 201 })
};

/**
 * @openapi
 * /api/user:
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
export const GET = async ({ request }) => {
    const email = request.headers.get('email');
    if (email) {
        const user = await GetUserByEmail(email);
        if (user && user[0]) {
            return new Response(JSON.stringify({ message: "Success", uuid: `${user[0].userId}`}), { status: 201 })
        }
    }
    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}