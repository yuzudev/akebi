import * as Toml from 'https://deno.land/std@0.133.0/encoding/toml.ts';

export declare namespace OasisConfig {
    export interface t {
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

export const { config, handler } = Toml.parse(Deno.readTextFileSync('oasis.toml')) as unknown as OasisConfig.t;