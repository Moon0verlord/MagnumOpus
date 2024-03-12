import type { PageServerLoad } from "./$types";
import { getInititalChargingPorts } from "$lib/server/db";

export const load = (() => {
    const chargingPorts = getInititalChargingPorts();

    return {
        chargingPorts
    }
}) satisfies PageServerLoad;