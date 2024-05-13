import { json } from '@sveltejs/kit';
import { changePassword } from '$lib/server/db/dbComposables';
import {userId} from "../../../store";
import { get } from 'svelte/store';

export async function POST({ request }) {
  const { newPassword } = await request.json();

  try {
    const storedUserId = get(userId);
    await changePassword(newPassword, storedUserId);
    return json({ success: true });
  } catch (error) {
    return json({ error: 'An error occurred while changing the password' }, { status: 500 });
  }
}