import { PostUser } from '$lib/server/db/dbComposables';

// @ts-ignore
export const POST = async ({ request }) => {
    try {
        const body = await request.json();

        const result = await PostUser(body.name, body.email, body.password);

        if (result) {
            return new Response(JSON.stringify({ message: "Success"}), { status: 201 })
        }
    } catch (error) {
        console.error(error);
    }

    return new Response(JSON.stringify({ message: "Failed"}), { status: 400 })
}