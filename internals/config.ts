import { parse } from '../deps/toml.ts';

export declare namespace OasisConfig {
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
}

export const { config, handler } = parse(Deno.readTextFileSync('oasis.toml')) as OasisConfig.t;
