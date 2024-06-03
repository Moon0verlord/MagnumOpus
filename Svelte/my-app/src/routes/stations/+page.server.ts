import type { PageServerLoad } from "./$types";
import { GetAllPorts, GetAllStations } from "$lib/server/db/dbComposables";
import type { Port, Station } from "$lib/server/db/schema";

export type StationWithShowContent = Station & { showContent: boolean };

export const load: PageServerLoad = async () => {
    const chargingPorts: Port[] = await GetAllPorts();
    const stations: Station[] = await GetAllStations();
    const stationsWithShowContent: StationWithShowContent[] = stations.map(station => ({ ...station, showContent: false }));

    return {
        props: {
            chargingPorts,
            stations: stationsWithShowContent
        }
    }
};