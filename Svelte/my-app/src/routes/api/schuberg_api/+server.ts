import { API_URL } from '$env/static/private';

export const GET = async ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || authHeader !== "Skibidi Toilet") {
        return new Response(JSON.stringify({message: "Unauthorized"}), { status: 401 })
    }

    const res = await fetch(API_URL);
    const data = await res.json();

    return new Response(JSON.stringify(data), { status: 200 })
}