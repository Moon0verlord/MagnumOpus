import type { PageServerLoad } from "./$types";
import { myPorts, myRequests, incomingRequests, GetUserAdminStatus, allRequests, allOccupiedPorts, GetCars } from "$lib/server/db/dbComposables";

export const load: PageServerLoad = async ({ cookies }) => {
    let userId = null;
    let cars: any[string] = [];
    userId = cookies.get('userId');

    let uuidv4Regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    cars = await GetCars();

    if (userId !== null && userId !== undefined && uuidv4Regex.test(userId)) {
        const [portsData, requestsData, incomingData, userData, allrequestData, alloccupiedportsData] = await Promise.all([
            myPorts(userId),
            myRequests(userId),
            incomingRequests(userId),
            GetUserAdminStatus(userId),
            allRequests(),
            allOccupiedPorts(),
        ]);

        let ports, requests, incoming, user, admin, requestsAll, usedPorts;

        if (portsData !== null) {
            ports = portsData.map(port => ({ ...port, showContent: false }));
        }
        if (requestsData !== null) {
            requests = requestsData.map(request => ({ ...request, showContent: false }));
        }
        if (incomingData !== null) {
            incoming = incomingData.map(incoming => ({ ...incoming, showContent: false }));
        }
        if (userData !== null) {
            user = userData.pop();
            admin = user?.isAdmin;
        }
        if (allrequestData !== null) {
            requestsAll = allrequestData.map(request => ({ ...request, showContent: false }));
        }
        if (alloccupiedportsData !== null) {
            usedPorts = alloccupiedportsData.map(port => ({ ...port, showContent: false }));
        }
        if (user !== null && ports !== null && user !== undefined && ports !== undefined)
        {
            if (ports.length >= 1)
            {
                if (user?.lastChargeTime !== null)
                {
                    const port = ports[0];
                    if(port.maxPower) {
                        const date = new Date();
                        const millis = date.getTime();
                        const lastCharge = user.lastChargeTime;
                        if (lastCharge !== null && lastCharge !== undefined && user.BatteryMax) {
                            const timeAway = Math.floor((millis - parseFloat(lastCharge)) / 1000);
                            const chargeRate = parseFloat(user.BatteryMax) / port.maxPower;

                            const charge = Math.min(100, Number(user.BatteryCurrent) + Math.floor(timeAway / chargeRate));
                            if (charge < 100) {
                                user.BatteryCurrent = String(charge);
                            }
                        }
                    }
                }
            }
        }
        
        return {
            props: {
                userId: userId,
                ports: ports,
                requests: requests,
                incoming: incoming,
                user: user,
                admin: admin,
                requestsAll: requestsAll,
                usedPorts: usedPorts,
                cars: cars,
            }
        };
    }

    // If userId is not defined, return an empty props object
    return {
        props: {
            userId: null,
            ports: [],
            requests: [],
            incoming: [],
            user: null,
            admin: false,
            requestsAll: [],
            usedPorts: [],
            cars: cars,
        }
    };
};