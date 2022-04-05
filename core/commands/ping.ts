import type { Context } from '../../deps/oasis.ts';
import { claim } from '../../deps/oasis.ts';
import { None, Some } from '../../deps/monads.ts';
import { InteractionResponseTypes } from '../../deps/discord.ts';

class Ping {
    readonly data = {
        name: 'ping',
        description: 'ping the bot',
    };

    constructor() {
        claim(this);
    }

    async run(ctx: Context) {
        const now = Date.now();
        // TODO: make it compatible
        if (ctx.message) {
            const msg = await ctx.respondWith('Measuring latency...');

            if (msg.isSome()) {
                const time = Date.now() - now;

                await ctx.bot.contents.helpers.editMessage(
                    msg.unwrap().channelId,
                    msg.unwrap().id,
                    {
                        content: `Pong! (${time}ms)`,
                    },
                );
            }
        }
    }
}
export default Ping;

new Ping();
