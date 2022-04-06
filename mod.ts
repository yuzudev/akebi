import { enableCachePlugin, enablePermissionsPlugin } from './deps/discord.ts';
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
        ready(bot, payload, rawPayload);
    };

    client.start();
}

if (import.meta.main) {
    main();
}
