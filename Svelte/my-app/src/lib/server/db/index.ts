import Database from "better-sqlite3";
import { v4 as uuidv4 } from 'uuid';
import type { User, Request, Station, Port } from "./types";

const db = new Database("./data/Main.db");

// export function getTheme(userId: string): string {
//     const query = `SELECT theme FROM Users WHERE id = ?`;
//     const row = db.prepare(query).get(userId);
//     if (row) {
//         return row.userTheme;
//     } else {
//         return "light";
//     }
// }

// export function updateTheme(userId: string, theme: string): boolean {
//     const query = `UPDATE Users SET theme = ? WHERE id = ?`;
//     const info = db.prepare(query).run(theme, userId);
//     return info.changes === 1;
// }

export function getInitialUsers(): User[] {
    const query = `SELECT userId AS userId, name AS userName, email AS userEmail, password AS userPassword FROM Users`;
    const rows = db.prepare(query).all();
    return rows as User[];
}

// export function postUser(name: string, email: string, password: string): boolean {
//     const userId = uuidv4();
//     const query = `INSERT INTO Users (userId, name, email, password, isAdmin) VALUES (?, ?, ?, ?, ?)`;
//     const info = db.prepare(query).run(userId, name, email, password, 0);
//     return info.changes === 1;
// }

export function loginUser(email: string, password: string): User | null {
    const query = `SELECT userId AS userId, name AS userName, email AS userEmail, password AS userPassword FROM Users WHERE LOWER(email) = LOWER(?) AND password = ?`;
    const row = db.prepare(query).get(email, password);
    return row ? row as User : null;
}

export function getUserByEmail(userEmail: string, userPassword: string): User | null {
    const query = `SELECT id AS userId, name AS userName, email AS userEmail, password AS userPassword FROM Users WHERE LOWER(email) = LOWER(?) AND password = ?`;
    const row = db.prepare(query).get(userEmail, userPassword);
    return row ? row as User : null;
}


export function getInitialStations(): Station[] {
    const query = `SELECT * FROM Stations`;
    const rows = db.prepare(query).all();
    return rows as Station[];
}

export function getInitialPorts(): Port[] {
    const query = `SELECT * FROM Ports`;
    const rows = db.prepare(query).all();
    return rows as Port[];
}

export function getInitialRequests(): Request[] {
    const query = `SELECT * FROM Requests`;
    const rows = db.prepare(query).all();
    return rows as Request[];
}

export function postStation(station: Station): boolean {
    const query = `INSERT INTO Stations VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const info = db.prepare(query).run(station.stationId, station.locationId, station.overallStatus, JSON.stringify(station.coordinates), station.address, station.maxPower, JSON.stringify(station.portIds));
    return info.changes === 1;
}

export function postPort(port: Port): boolean {
    const query = `INSERT INTO Ports VALUES (?, ?, ?, ?, ?)`;
    const info = db.prepare(query).run(port.portId, port.stationId, port.usedByUser, port.emi3Id, port.status);
    return info.changes === 1;
}

export function postRequest(request: Request): boolean {
    const query = `INSERT INTO Requests VALUES (?, ?, ?, ?, ?, ?)`;
    const info = db.prepare(query).run(request.requestId, request.priority, request.fromUserId, request.toUserId, request.portId, request.message);
    return info.changes === 1;
}