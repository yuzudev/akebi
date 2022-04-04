import type { Context } from "../../deps/discord.ts";
import type { Option } from "../../deps/monads.ts";
import { Argument, claim } from "../../deps/discord.ts";
import { Some, None } from "../../deps/monads.ts";

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
        claim(this, this.options);
    }

    // run the command
    async run(ctx: Context) {
        const question = ctx.options.andThen(o => Some(o[0])).unwrap();
        const response = responses[Math.floor(Math.random() * responses.length)];

        // send the response
        await ctx.respond({ content: `Question: ${question.value} | Reply: ${response}` });
    }
}

// useful for other kinds of handlers
export default EightBall;

// add the command to cache because of calling claim() earlier
new EightBall;