import type { RequestHandler } from '@sveltejs/kit';
import {GetUserAdminStatus} from "$lib/server/db/dbComposables";
import type {User} from "$lib/server/db/schema";

/**
 * @openapi
 * /api/admin:
 *   post:
 *     summary: Check if user is admin
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
 *                 isAdmin:
 *                   type: boolean
 */
// @ts-ignore
export const POST = async ({ request }) => {
    const body = await request.json();
    let userIsAdmin: User[] = await GetUserAdminStatus(body.userId)
    const status = userIsAdmin.pop()?.isAdmin
    return new Response(JSON.stringify({ message: "Success", isAdmin: (status == null || false ? false : status )}), { status: 201 })
};