export type Station = {
    stationId: string;
    locationId: string;
    overallStatus: 'available' | 'charging' | 'out_of_order';
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
    status: 'available' | 'charging' | 'out_of_order';
}

export type Request = {
    requestId: string;
    priority: 'high' | 'medium' | 'low';
    fromUserId: string;
    toUserId: string;
    portId: string;
    message: string;
}

export type User = {
    userId: string;
    name: string;
    email: string;
    password: string;
    userTheme: string | null;
    oktaId: string | null;
    isAdmin: boolean;
}