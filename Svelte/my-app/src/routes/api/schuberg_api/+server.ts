import { API_URL } from '$env/static/private';

/**
 * @openapi
 * /api/schuberg_api:
 *   get:
 *     summary: Fetch data from API
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// @ts-ignore
export const GET = async ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || authHeader !== "Skibidi Toilet") {
        return new Response(JSON.stringify({message: "Unauthorized"}), { status: 401 })
    }

    const res = await fetch(API_URL);
    const data = await res.json();

    return new Response(JSON.stringify(data), { status: 200 })
}