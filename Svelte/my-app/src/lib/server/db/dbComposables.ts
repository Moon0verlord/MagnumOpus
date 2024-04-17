import {type Port, Ports, type Station, Stations} from "$lib/server/db/schema";
import {db} from "$lib/server/db/db.server";

export const GetAllPorts = async () : Promise<Port[]> => {
    return await db.select().from(Ports).execute();
};

export const GetAllStations = async () : Promise<Station[]> => {
    return await db.select().from(Stations).execute();
};