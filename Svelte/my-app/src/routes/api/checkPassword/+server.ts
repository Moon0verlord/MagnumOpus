import { json } from '@sveltejs/kit';
import { checkPassword } from '$lib/server/db/dbComposables';

/**
 * @openapi
 * /api/checkPassword:
 *   post:
 *     summary: Check user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
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
 *       400:
 *         description: Invalid current password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: An error occurred while checking the password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
// @ts-ignore
export const POST = async ({ request }) => {
  const { currentPassword, userId } = await request.json();

  try {
    if (!userId) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isPasswordValid = await checkPassword(currentPassword, userId);
    if (isPasswordValid) {
      return json({ success: true });
    } else {
      return json({ error: 'Invalid current password' }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return json({ error: 'An error occurred while checking the password' }, { status: 500 });
  }
}