export type Station = {
    stationId: string;
    locationId: string;
    overallStatus: 'available' | 'occupied' | 'unavailable';
    coordinates: number[];
    address: string;
    maxPower: number;
    portIds: string[];
}

export type Port = {
    portId: string;
    stationId: string;
    usedByUser: string | null ;
    emi3Id: string;
    status: 'available' | 'occupied' | 'unavailable';
    timeRemaining: Date | null;
    maxPower: number;
}

export type Car = {
    model: string;
    battery: number;
};

export type CarData = {
    [key: string]: Car[];
};

export type Request = {
    requestId: string;
    priority: 'high' | 'medium' | 'low';
    fromUserId: string;
    toUserId: string;
    portId: string;
    message: string;
    percent: number;
}

export type User = {
    userId: string;
    name: string;
    email: string;
    password: string;
    userTheme: string | null;
    oktaId: string | null;
    isAdmin: boolean;
    totalXp: number;
    level: number;
    carModel: string;
    BatteryMax: number;
    BatteryCurrent: number;
}

export type Address = {
    state: string | null;
    streetName: string;
    postcode: string;
    city: string;
    country: {
        code: string;
        name: string;
    };
}

export enum Status {
    Available = "available",
    Occupied = "occupied",
    Unavailabe = "unavailable"
}

export interface StationData {
    id: string;
    locationId: string;
    reference: string | null;
    status: string;
    coordinates: {
        lng: number;
        lat: number;
    };
    address: {
        state: string | null;
        streetName: string;
        postcode: string;
        city: string;
        country: {
            code: string;
            name: string;
        };
    };
    maxPower: number;
    evses: {
        id: string;
        emi3Id: string;
        status: string;
        connectors: Array<any>;
    }[];
    connectors: {
        status: string;
        type: string;
        format: string;
    }[];
    visibilityScope: string;
    accountId: string | null;
    externalAccountId: string | null;
    externalParentAccountId: string | null;
}