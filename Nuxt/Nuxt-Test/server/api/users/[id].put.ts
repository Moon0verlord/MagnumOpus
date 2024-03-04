import {users, User, InsertUser} from "~/db/schemas/schema";
import {eq} from "drizzle-orm"
import {db, sqlite} from "../../sqlite-service"

export default defineEventHandler(async (event) => {
    try {
        const userId = event.context.params?.id as string;
        const body = await readBody(event);
        const editUser: InsertUser = {
            ...body
        }
        const userResp = db.update(users).set(editUser).where(eq(users.id, parseInt(userId))).run();
        return { user : userResp };
    } catch (e: any) {
        throw createError({
            statusCode: 400,
            statusMessage: e.message
        });
    }
});