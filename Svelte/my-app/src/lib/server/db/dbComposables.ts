import {type Port, Ports, type Station, Stations} from "$lib/server/db/schema";
import {db} from "$lib/server/db/db.server";
import {eq} from "drizzle-orm";

export const GetAllPorts = async () : Promise<Port[]> => {
    return await db.select().from(Ports).execute();
};

export const GetAllStations = async () : Promise<Station[]> => {
    return await db.select().from(Stations).execute();
};

export const GetAllPortsFromStation = async (stationId: string) : Promise<Port[]> => {
    return await db.select().from(Ports).where(eq(Ports.stationId, stationId)).execute();
}