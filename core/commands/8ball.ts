import { Command, Context, Argument, Alias } from "../../deps/discord.ts";

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

@Alias([ "ball" ])
class EightBall extends Command {
    // define data as static so Alias() can be used
    public static readonly data = {
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
        super();
        // make sure to call options so it does emit meta data
        Command.claim(this, this.options);
    }

    // run the command
    public async run(ctx: Context) {
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