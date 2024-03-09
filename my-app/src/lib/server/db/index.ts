import Database from "better-sqlite3";
import type { User } from "./types";
import type { ChargingPort } from "./types";

const db = new Database("./data/Main.db");

export function getInititalUsers(): User[] {
    const query = `select Users.id as userId
    , Users.name as userName
    , Users.email as userEmail
    , Users.password as userPassword
    from Users
    `;

    const stmnt = db.prepare(query);
    const rows = stmnt.all();
    return rows as User[];
}

export function getUserByEmail(userEmail: string, userPassword: string): User | null {
    const query = `select Users.id as userId
    , Users.name as userName
    , Users.email as userEmail
    , Users.password as userPassword
    
    from Users
    where LOWER(Users.email) = LOWER(?) and Users.password = ?
    `;

    const stmnt = db.prepare(query);
    const row = stmnt.get(userEmail, userPassword);
    return row ? row as User : null;
}

export function getInititalChargingPorts(): ChargingPort[] {
    const query = `select ChargingPorts.id as chargingPortId
    , ChargingPorts.port_number as chargingPortNumber
    , ChargingPorts.charging_speed as chargingPortSpeed
    , ChargingPorts.status as chargingPortStatus
    from ChargingPorts
    `;

    const stmnt = db.prepare(query);
    const rows = stmnt.all();
    return rows as ChargingPort[];
}