import { BitwisePermissionFlags, enableCachePlugin, enablePermissionsPlugin } from './deps/discord.ts';
import { enableMiddleware } from './internals/middleware.ts';
import { Client } from './internals/client.ts';

// deno-fmt-ignore
const BASE_PERMISSIONS = 0
    | BitwisePermissionFlags.VIEW_CHANNEL
    | BitwisePermissionFlags.SEND_MESSAGES
    | BitwisePermissionFlags.EMBED_LINKS
    | BitwisePermissionFlags.ATTACH_FILES
    | BitwisePermissionFlags.READ_MESSAGE_HISTORY
    | BitwisePermissionFlags.CHANGE_NICKNAME;

const inviteUrl = (botId: bigint, perms: number) => (
    `https://discord.com/oauth2/authorize?client_id=${botId}&scope=bot%20applications.commands&permissions=${perms}`
);

function main() {
    const client = new Client();

    client
        .use(enableMiddleware)
        .use(enableCachePlugin)
        .use(enablePermissionsPlugin);

    const { ready } = client.bot.events;

    client.bot.events.ready = (bot, payload, rawPayload) => {
        console.info('Ready! logged as %s with id %d', payload.user.username, bot.id);
        console.info(inviteUrl(bot.id, BASE_PERMISSIONS));
        ready(bot, payload, rawPayload);
    };

    client.start();
    // initDatabase();
}

if (import.meta.main) {
    main();
}
