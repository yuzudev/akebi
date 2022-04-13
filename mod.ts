import { BitwisePermissionFlags, enableCachePlugin, enablePermissionsPlugin } from './deps/discord.ts';
import { enableMiddleware } from './internals/middleware.ts';
import { Client } from './internals/client.ts';

function main() {
    const client = new Client();

    client
        .use(enableMiddleware)
        .use(enableCachePlugin)
        .use(enablePermissionsPlugin);

    const { ready } = client.bot.events;

    client.bot.events.ready = (bot, payload, rawPayload) => {
        console.info('Ready! logged as %s with id %d', payload.user.username, bot.id);
        console.info(inviteUrl(bot.id, BitwisePermissionFlags.ADMINISTRATOR));
        ready(bot, payload, rawPayload);
    };

    client.start();
    // initDatabase();
}

if (import.meta.main) {
    main();
}

const inviteUrl = (botId: bigint, perms: number): string => (
    `https://discord.com/oauth2/authorize?client_id=${botId}&scope=bot application.commands&permissions=${perms}`
);
