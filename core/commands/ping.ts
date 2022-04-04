import type { Context } from "../../deps/oasis.ts";
import { claim } from "../../deps/oasis.ts";

class Ping {
    readonly data = {
        name: "ping",
        description: "ping the bot",
    };

    constructor() {
        claim(this);
    }

    async run(ctx: Context) {
        await ctx.respond({ content: "pong!" });
    }
}

export default Ping;

new Ping;