import {db} from "~/server/sqlite-service";
import {Port, Ports} from "~/db/schemas/schubergSchema";
import {eq} from "drizzle-orm";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        if (!body.hasOwnProperty('portId'))
            throw new Error('POST Body does not contain a portId parameter.')
        const portId: string = body.portId;
        const result = db.update(Ports).set({ status: 'charging' }).where(eq(Ports.portId, portId)).run();
        if (result.changes >= 1)
            return "200 OK!"
        else {
            return "304 Not Modified"
        }
    }
    catch (e: any) {
        throw createError({
            statusCode: 400,
            statusMessage: e.message
        });
    }
});