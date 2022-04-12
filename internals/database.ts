import { Client } from "../deps/postgre.ts";
import { database as db } from "./config.ts";

export async function initDatabase(): Promise<Client> {
    const client = new Client({
        user: db.user,
        password: db.password,
        database: db.database,
        hostname: db.hostname,
        port: db.port || 5432
    })

    await client.connect();
    return client;
}  