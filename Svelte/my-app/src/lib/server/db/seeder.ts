import {db} from "$lib/server/db/db.server"
import type {Address, Port, Station, StationData, Status} from "$lib/server/db/types";
import {eq, sql} from "drizzle-orm";
import {Ports, Stations} from "$lib/server/db/schema";
import { API_URL } from '$env/static/private';

export const getData = async (json?: any) => {
    let stationData: StationData[] = [];
    try {
        let responseData;
        if (json == null)
        {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            responseData = await response.json();
        }
        else {
            responseData = json;
        }
        stationData = responseData.stationList.map((station: any) => ({
            id: station.id,
            locationId: station.locationId,
            reference: station.reference,
            status: station.status,
            coordinates: station.coordinates,
            address: station.address,
            maxPower: station.maxPower,
            evses: station.evses,
            connectors: station.connectors,
            visibilityScope: station.visibilityScope,
            accountId: station.accountId,
            externalAccountId: station.externalAccountId,
            externalParentAccountId: station.externalParentAccountId
        }));
        return stationData;
    } catch (error) {
        console.error('Error fetching station data:', error);
    }
    return stationData;
};

const getPortIds = (data : StationData) : string => {
    let portIds = "";
    for (const [i, value] of data.evses.entries()) {
        if (i === data.evses.length - 1)
            portIds += `${value.id}`
        else
            portIds += `${value.id},`
    }
    return portIds
}

export const Seeder = async (data : StationData[]) => {
    for (const station of data) {
        await db.insert(Stations).values({
            stationId: station.id,
            locationId: station.locationId,
            overallStatus: station.status,
            coordinates: `${station.coordinates.lng},${station.coordinates.lat}`,
            address: JSON.stringify(station.address),
            maxPower: station.maxPower,
            portIds: getPortIds(station),
        });

        for (const port of station.evses) {
            await db.insert(Ports).values({
                portId: port.id,
                stationId: station.id,
                usedBy: null,
                emi3Id: port.emi3Id,
                status: port.status,
            });
        }
    }
}

export const allPortsAvailable = async () => {
    const allPorts = await db.select().from(Ports).execute();

    for (const port of allPorts) {
        await db.update(Ports)
            .set({ status: 'available' })
            .where(eq(Ports.portId, port.portId))
            .execute();
    }
}

export const allStationsAvailable = async () => {
    const allStations = await db.select().from(Stations).execute();

    for (const station of allStations) {
        await db.update(Stations)
            .set({ overallStatus: 'available' })
            .where(eq(Stations.stationId, station.stationId))
            .execute();
    }
}