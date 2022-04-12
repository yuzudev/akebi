import { parse } from '../deps/toml.ts';

export const PATH = 'oasis.toml';

export interface t extends Record<string, unknown> {
    config: {
        ownerId: string;
        prefix: string;
        token: string;
        botId: string;
        supportGuildId: string;
        logsChannelId: string;
        intents: string[];
        development: boolean;
    };
    handler: {
        rootDirectory?: string;
        loadDirectories?: string[];
        temporaryFile?: boolean;
    },
    database: {
        user: string,
        password: string,
        database: string,
        hostname: string,
        port?: number
    }
}

export const { config, handler, database } = <t> parse(Deno.readTextFileSync(PATH));
