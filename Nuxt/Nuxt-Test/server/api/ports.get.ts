import { Ports } from "~/db/schemas/schubergSchema";
import { db, sqlite } from "../sqlite-service"

export default defineEventHandler(async (event) => {
    try {
        const portResponse = db.select().from(Ports).all();
        return { ports : portResponse };
    }
    catch (e: any) {
        throw createError({
            statusCode: 400,
            statusMessage: e.message
        });
    }
});