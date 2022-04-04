import * as Toml from "https://deno.land/std@0.133.0/encoding/toml.ts";

declare namespace Config {
    export interface t {
        ownerId: string;
        prefix: string;
        token: string;
        botId: string;
        supportGuildId: string;
        logsChannelId: string;
        intents: string[];
        development: boolean;
    }
}

export const { config: Config } = Toml.parse(
    Deno.readTextFileSync("oasis.toml")
) as unknown as { config: Config.t; };
export default Config;