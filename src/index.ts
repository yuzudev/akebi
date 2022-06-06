import { BitwisePermissionFlags, GatewayIntents, type EventHandlers } from "discordeno";
import { enableCachePlugin } from "discordeno/cache-plugin";
import { enableMiddleware } from "./internals/middleware.js";
import { OasisClient } from "oasis-framework";
import { enableCommandContext } from "oasis-framework/contrib";
import { loadDirs } from "oasis-framework";

// command handler
import { config, handler } from "./internals/config.js";

// side effects
import "./internals/database.js";

if (handler) {
    const { rootDirectory, loadDirectories } = handler;

    if (!loadDirectories) {
        throw new Error("handler.load is required");
    }

    if (!rootDirectory) {
        throw new Error("handler.root is required");
    }

    loadDirs(rootDirectory, loadDirectories);
}

class Client extends OasisClient {
    constructor(events: Partial<EventHandlers> = {}) {
        super(events);

        super.setToken(config.token);
        (config.intents as Array<keyof typeof GatewayIntents>)
            .map(intent => GatewayIntents[intent])
            .forEach(intent => super.addIntent(intent));
    }
}

// prettier-ignore
const BASE_PERMISSIONS =
      BitwisePermissionFlags.VIEW_CHANNEL
    | BitwisePermissionFlags.SEND_MESSAGES
    | BitwisePermissionFlags.EMBED_LINKS
    | BitwisePermissionFlags.ATTACH_FILES
    | BitwisePermissionFlags.READ_MESSAGE_HISTORY
    | BitwisePermissionFlags.CHANGE_NICKNAME;

const inviteUrl = (botId: bigint, perms: number) =>
    "https://discord.com/oauth2/" +
    `authorize?client_id=${botId}&scope=bot%20applications.commands&permissions=${perms}`;

const client = new Client({
    ready(bot, payload) {
        console.info("Ready! logged as %s with id %d", payload.user.username, bot.id);
        console.info(inviteUrl(bot.id, BASE_PERMISSIONS));
    },
});

await client.start([
    enableMiddleware,
    enableCachePlugin,
    (bot) => { enableCommandContext(config.prefix)(bot); return bot }
]);
