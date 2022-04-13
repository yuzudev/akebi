import type { Context } from '../../deps/oasis.ts';
import { Argument, Command } from '../../deps/oasis.ts';

// define responses
const responses = [
    'It is certain',
    'It is decidedly so',
    'Without a doubt',
    'Yes, definitely',
    'You may rely on it',
    'Most likely',
    'Outlook good',
    'Yes',
];

@Command
class EightBall {
    readonly data = {
        name: `${responses.length}ball`,
        description: 'Ask the magic 8ball a question',
    };

    readonly aliases = ['ball'];

    // declare string option 'question' as required
    @Argument('The question', true)
    declare question: string;

    // get all options
    get options(): unknown[] {
        return [this.question];
    }

    // run the command
    async run(ctx: Context) {
        const question = ctx.getString(0) ?? ctx.getString('question', true);
        const response = responses[Math.floor(Math.random() * responses.length)];

        // send the message
        await ctx.respond({ content: `Question: ${question} | Reply: ${response}` });
    }
}

// useful for other kinds of handlers
export default EightBall;

// add the command to cache because of calling claim() earlier
// new EightBall();
