import { json } from '@sveltejs/kit';
import { checkPassword } from '$lib/server/db/dbComposables';
import {userId} from "../../../store";
import { get } from 'svelte/store';

export const POST = async ({ request }) => {
  const { currentPassword } = await request.json();

  try {
    const storedUserId = get(userId);
    if (!storedUserId) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isPasswordValid = await checkPassword(currentPassword, storedUserId);
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