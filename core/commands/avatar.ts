import type { Context } from '../../deps/oasis.ts';
import type { BotWithCache } from '../../deps/discord.ts';
import { Argument, claim } from '../../deps/oasis.ts';
import { None, type Option, Some } from '../../deps/monads.ts';

class Avatar {
    readonly data = {
        name: 'avatar',
        description: 'Get the avatar of a user',
    };

    readonly aliases = ['pfp', 'avy', 'icon'];

    @Argument.User('The user to get the avatar of')
    declare user: unknown;

    private get options(): unknown[] {
        return [this.user];
    }

    constructor() {
        claim(this, this.options, this.aliases);
    }

    async run(ctx: Context<BotWithCache>) {
        const user = Some(
            ctx.options.isSome() && ctx.options.unwrap()[0] !== undefined
                ? ctx.bot.contents.users.get(BigInt(ctx.options.unwrap()[0].value as string))
                : ctx.messageContext.isSome()
                ? ctx.bot.contents.users.get(ctx.messageContext.unwrap().message.authorId)
                : ctx.interactionContext.isSome()
                ? ctx.interactionContext.unwrap().interaction.user
                : undefined,
        );

        if (user.isNone()) {
            await ctx.respondWith('Unkown user');
            return;
        }

        const avatar = ctx.bot.contents.helpers.avatarURL(
            user.unwrap().id,
            user.unwrap().discriminator,
            {
                size: 2048,
                avatar: user.unwrap().avatar,
            },
        );

        await ctx.respondWith(avatar);
    }
}

export default Avatar;

new Avatar();
