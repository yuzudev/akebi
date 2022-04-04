import type { Context } from "../../deps/oasis.ts";
import type { Option } from "../../deps/monads.ts";
import type { BotWithCache } from "../../deps/discord.ts";
import { Argument, claim } from "../../deps/oasis.ts";
import { None, Some } from "../../deps/monads.ts";

// define responses
const responses = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes, definitely",
    "You may rely on it",
    "Most likely",
    "Outlook good",
    "Yes",
];

class EightBall {
    readonly data = {
        name: `${responses.length}ball`,
        description: "Ask the magic 8ball a question",
    };

    readonly aliases = ["ball"];

    // declare string option 'question' as required
    @Argument("The question", true)
    declare question: string;

    // get all options
    private get options(): unknown[] {
        return [this.question];
    }

    // add the command to cache (claim) on instantiation
    constructor() {
        // make sure to call options so it does emit meta data
        claim(this, this.options, this.aliases);
    }

    // run the command
    async run(ctx: Context) {
        const question = ctx.options.andThen((o) => Some(o[0])).unwrap();
        const response = responses[Math.floor(Math.random() * responses.length)];

        // send the message
        await ctx.respond({ content: `Question: ${question.value} | Reply: ${response}` });
    }
}

// useful for other kinds of handlers
export default EightBall;

// add the command to cache because of calling claim() earlier
new EightBall();
