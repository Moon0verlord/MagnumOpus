import { json } from '@sveltejs/kit';
import { changePassword } from '$lib/server/db/dbComposables';

/**
 * @openapi
 * /api/changePassword:
 *   post:
 *     summary: Change user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       500:
 *         description: An error occurred while changing the password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
// @ts-ignore
export async function POST({ request }) {
  const { newPassword, userId } = await request.json();

  try {
    await changePassword(newPassword, userId);
    return json({ success: true });
  } catch (error) {
    return json({ error: 'An error occurred while changing the password' }, { status: 500 });
  }
}