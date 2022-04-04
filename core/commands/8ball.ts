import {
    Context,
    Argument,
    claim,
} from "../../deps/discord.ts";

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
    public readonly data = {
        name: `${responses.length}ball`,
        description: "Ask the magic 8ball a question",
    };

    // declare string option as required
    @Argument("The question", true)
    declare question: string;

    // get all options
    private get options(): unknown[] {
        return [this.question];
    }

    // claim the command on instantiation
    public constructor() {
        // make sure to call options so it does emit meta data
        claim(this, this.options);
    }

    // run the command
    public async run(ctx: Context) {
        console.log(ctx);

        const question = ctx.options.unwrap()[0]
        const response = EightBall.rand(responses);

        // send the response
        await ctx.respond({ content: `Question: ${question?.value} | Reply: ${response}` });
    }

    // utilities
    public static rand<T>(arr: T[]) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}

// add the command to cache
new EightBall;