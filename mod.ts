import { enableCachePlugin, enablePermissionsPlugin } from "./deps/discord.ts";
import { enableMiddleware } from "./middleware.ts";
import { createBot, startBot } from "./util/client.ts";

function main(args: string[]): void {
    const client = createBot({
        intents: [ "Guilds", "GuildMessages" ],
        plugins: [ enableMiddleware, enableCachePlugin, enablePermissionsPlugin ],
        handler: {
            root: "core",
            load: ["commands"],
            temp: true, // create a temporary file
        },
    });

    client.events.ready = (bot, payload) => {
        console.info("Ready! logged as %s with id %d", payload.user.username, bot.id);
    };

    startBot(client);
}

if (import.meta.main) {
    main(Deno.args);
}