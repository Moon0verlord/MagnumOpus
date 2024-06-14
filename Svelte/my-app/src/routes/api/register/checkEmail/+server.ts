import { json } from '@sveltejs/kit';
import { GetUserByEmail } from '$lib/server/db/dbComposables';

export const POST = async ({ request }) => {
    const { email } = await request.json();

    if (!email) {
        return json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await GetUserByEmail(email);

    if (user && user[0]) {
        return json({ exists: true }, { status: 200 });
    } else {
        return json({ exists: false }, { status: 200 });
    }
};