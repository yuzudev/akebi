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
    };
}

export const { config, handler } = <t> parse(Deno.readTextFileSync(PATH));
