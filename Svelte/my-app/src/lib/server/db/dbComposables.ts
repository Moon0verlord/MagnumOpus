import {type Port, Ports} from "$lib/server/db/schema";
import {db} from "$lib/server/db/db.server";

export const GetAllPorts = async () : Promise<Port[]> => {
    return await db.select().from(Ports).execute();
};
