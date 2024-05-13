import { json } from '@sveltejs/kit';
import { checkPassword } from '$lib/server/db/dbComposables';

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