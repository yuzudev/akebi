import toml from "toml";
import fs from "fs";

export const PATH = "oasis.toml";

export interface Conf extends Record<string, unknown> {
    config: {
        prefix: string;
        ownerId: string;
        token: string;
        supportGuildId: string;
        logsChannelId: string;
        intents: string[];
        development: boolean;
    };
    handler: {
        rootDirectory?: string;
        loadDirectories?: string[];
    };
}

export const { config, handler, database } = <Conf>toml.parse(fs.readFileSync(PATH, "utf8"));
