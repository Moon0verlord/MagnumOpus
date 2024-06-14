import {type InferInsertModel, type InferSelectModel, sql} from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core"
import postgres from "postgres";
import from = postgres.toPascal.column.from;

export const Users  = pg.pgTable("Users", {
    userId: pg.text("user_id").primaryKey(),
    level: pg.integer("level"),
    totalXp: pg.integer("total_xp"),
    name: pg.text("name"),
    email: pg.text("email").unique(),
    password: pg.text("password"),
    oktaId: pg.text("okta_id"),
    isAdmin: pg.boolean('isAdmin'),
    BatteryMax: pg.decimal("battery_max"),
    BatteryCurrent: pg.decimal("battery_current"),
    carModel: pg.text("car_model"),
    // Unix Timestamp
    lastChargeTime: pg.text("last_charge_time"),
});

export type User = InferSelectModel<typeof Users>;

export const Stations = pg.pgTable("Stations", {
    stationId: pg.text("station_id").primaryKey(),
    locationId: pg.text("location_id"),
    overallStatus: pg.text("status"),
    coordinates: pg.text("coordinates"),
    address: pg.json("address"),
    maxPower: pg.real("max_power"),
    portIds: pg.text("port_ids") // needs to be parsed into an array on leaving
});

export type Station = InferSelectModel<typeof Stations>;

export const Ports = pg.pgTable("Ports", {
    portId: pg.text("port_id").primaryKey(),
    stationId: pg.text("station_id").references(() => Stations.stationId),
    usedBy: pg.text("used_by").references(() => Users.userId),
    emi3Id: pg.text("emi3_id"),
    status: pg.text("status"),
    maxPower: pg.real("max_power"),
    displayName: pg.text("display_name"),
    timeRemaining: pg.timestamp("time_remaining")
});

export type Port = InferSelectModel<typeof Ports>;

export const Requests = pg.pgTable("Requests", {
    requestId: pg.serial("request_id").primaryKey(),
    priority: pg.text("priority"),
    fromUserId: pg.text("from_userid").references(() => Users.userId),
    requestedPortId: pg.text("requested_portid").references(() => Ports.portId),
    message: pg.text("message"),
    percent: pg.integer("percent"),
});
export type Request = InferSelectModel<typeof Requests>;

