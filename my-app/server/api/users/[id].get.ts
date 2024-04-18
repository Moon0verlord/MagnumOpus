import {users, User} from "~/db/schemas/schema";
import {eq} from "drizzle-orm"
import {db, sqlite} from "../../sqlite-service"

export default defineEventHandler(async (event) => {
    try {
        const userId = event.context.params?.id as string;
        const userResp = db.select().from(users).where(eq(users.id, parseInt(userId))).get();
        return { user : userResp };
    } catch (e: any) {
        throw createError({
            statusCode: 400,
            statusMessage: e.message
        });
    }
});