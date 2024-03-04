import { users, User } from "~/db/schemas/schema";
import { db, sqlite } from "../sqlite-service"

export default defineEventHandler(async (event) => {
    try {
        const userResponse = db.select().from(users).all();
        return { users : userResponse };
    }
    catch (e: any) {
        throw createError({
            statusCode: 400,
            statusMessage: e.message
        });
    } 
});