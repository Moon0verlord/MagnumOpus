import {db} from "~/server/sqlite-service"
import {Address, Ports, Stations, Status} from "~/db/schemas/schubergSchema";
import type {StationData} from "~/composables/useTypes";
import {ref} from 'vue';

export const getData = async () => {
    const stationData = ref<StationData[]>([]);

    try {
        const response = await fetch('https://schubergphilis.workflows.okta-emea.com/api/flo/d71da429cdb215bef89ffe6448097dee/invoke?clientToken=01d762901510b3c7f422595fa18d8d7bd71c1f3e58ad860fd3ae2d0c87a80955&url=/poi/v1/locations&method=GET');
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const responseData = await response.json();
        stationData.value = await responseData.stationList.map((station: any) => ({
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

const Seeder = (data : StationData[]) => {
    data.forEach(station => {
            // Can't do a mass insert and then run once after bulk insertion sadly, drizzle seems to not support this i thonk.
            // running after each insert works for now.
            db.insert(Stations).values({
                stationId: station.id,
                locationId: station.locationId,
                overallStatus: station.status,
                coordinates: `${station.coordinates.lng},${station.coordinates.lat}`,
                address: JSON.stringify(station.address),
                maxPower: station.maxPower,
                portIds: getPortIds(station),
            }).run();

            station.evses.forEach(port => {
                db.insert(Ports).values({
                    portId: port.id,
                    stationId: station.id,
                    usedBy: null,
                    emi3Id: port.emi3Id,
                    status: port.status,
                }).run();
            });
    });
}

export default defineEventHandler(async (event) => {
    try {
        await Seeder((await getData()).value)
        return "Seeder has completed successfully!"
    }
    catch (e: any) {
        throw createError({
            statusCode: 400,
            statusMessage: e.message,
            status: e.status
        });
    }
});