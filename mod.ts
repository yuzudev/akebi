import { enableCachePlugin, enablePermissionsPlugin } from "./deps/discord.ts";
import { enableMiddleware } from "./internals/middleware.ts";
import { createBot, startBot } from "./internals/client.ts";

function main() {
    const client = createBot({
        plugins: [enableMiddleware, enableCachePlugin, enablePermissionsPlugin],
        handler: {
            root: "core",
            load: ["commands"],
            temp: true, // create a temporary file
        },
    });

    const { ready } = client.events;

    client.events.ready = (bot, payload, rawPayload) => {
        console.info("Ready! logged as %s with id %d", payload.user.username, bot.id);
        ready(bot, payload, rawPayload);
    };

    startBot(client);
}

if (import.meta.main) {
    main();
}
