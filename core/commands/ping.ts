import type { Context } from '../../deps/oasis.ts';
import { claim, Util } from '../../deps/oasis.ts';

class Ping {
    readonly data = {
        name: 'ping',
        description: 'ping the bot',
    };

    constructor() {
        claim(this);
    }

    private getPingFromContext(ctx: Context) {
        return Util.snowflakeToTimestamp(ctx.interaction ? ctx.interaction.id : ctx.message?.id!) - Date.now();
    }

    async run(ctx: Context) {
        const ping = this.getPingFromContext(ctx);
        await ctx.respondWith(`Pong! (${ping}ms)`);
    }
}
export default Ping;

new Ping();
