import type { Context } from '../../deps/oasis.ts';
import type { BotWithCache, User } from '../../deps/discord.ts';
import { Argument, claim } from '../../deps/oasis.ts';

class Avatar {
    readonly data = {
        name: 'avatar',
        description: 'Get the avatar of a user',
    };

    readonly aliases = ['pfp', 'avy', 'icon'];

    @Argument.User('The user to get the avatar of')
    declare user: User;

    private get options(): unknown[] {
        return [this.user];
    }

    constructor() {
        claim(this, this.options, this.aliases);
    }

    async run(ctx: Context<BotWithCache>) {
        const user = ctx.options?.[0]
            ? ctx.bot.users.get(BigInt(ctx.options?.[0].value as string))
            : ctx.messageContext
            ? ctx.bot.users.get(ctx.messageContext.message.authorId)
            : ctx.interactionContext
            ? ctx.interactionContext.interaction.user
            : undefined;

        if (!user) {
            await ctx.respondWith('Unkown user');
            return;
        }

        const avatar = ctx.bot.helpers.avatarURL(
            user.id,
            user.discriminator,
            {
                size: 2048,
                avatar: user.avatar,
            },
        );

        await ctx.respondWith(avatar);
    }
}

export default Avatar;

new Avatar();
