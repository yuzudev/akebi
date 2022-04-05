import { InteractionResponseTypes } from '../../deps/discord.ts';
import type { Context } from '../../deps/oasis.ts';
import { claim } from '../../deps/oasis.ts';

class Ping {
    readonly data = {
        name: 'ping',
        description: 'ping the bot',
    };

    constructor() {
        claim(this);
    }

    async run(ctx: Context) {
        const ping = snowflakeToTimestamp(ctx.interaction!.id) - Date.now();
        await ctx.bot.contents.helpers.sendInteractionResponse(
            ctx.interaction!.id,
            ctx.interaction!.token,
            {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: `Pong! (${ping}ms)`,
                },
            },
        );
    }
}
export default Ping;

new Ping();

export function snowflakeToTimestamp(id: bigint) {
    return Number(id / 4194304n + 1420070400000n);
}
