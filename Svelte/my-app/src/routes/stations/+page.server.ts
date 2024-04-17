import {getInitialPorts} from "$lib/server/db";
import type {PageServerLoad} from "./$types";
import {GetAllPorts} from "$lib/server/db/dbComposables";

export const load: PageServerLoad = async () => {
    const chargingPorts = await GetAllPorts();

    return {
        props: {
            chargingPorts,
        }
    }
};