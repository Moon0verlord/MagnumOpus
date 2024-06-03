import { json } from '@sveltejs/kit';
import { changePassword } from '$lib/server/db/dbComposables';

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