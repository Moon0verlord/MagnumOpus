// src/routes/api/seeder.ts
import {getData, allPortsAvailable, allStationsAvailable, Seeder} from "$lib/server/db/seeder";

export const GET = async () => {
    try {
        await Seeder((await getData()));
        await allPortsAvailable();
        await allStationsAvailable();
        return {
            status: 200,
            body: {
                message: "Seeder has completed successfully!"
            }
        };
    } catch (e: any) {
        console.error(e.message);
        console.error(e.stack);
        return {
            status: 500,
            body: {
                message: "Internal Error"
            }
        };
    }
};