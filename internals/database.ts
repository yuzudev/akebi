import { Client } from '../deps/postgre.ts';
import { database as db } from './config.ts';

let client: Client | undefined = undefined;

export function initDatabase() {
    client = new Client({
        user: db.user,
        password: db.password,
        database: db.database,
        hostname: db.hostname,
        port: db.port || 5432,
    });

    return client.connect();
}

export { client };
