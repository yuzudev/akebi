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
    declare 'user': User;

    private get options(): unknown[] {
        return [this.user];
    }

    constructor() {
        claim(this, this.options, this.aliases);
    }

    async run(ctx: Context<BotWithCache>) {
        // deno-fmt ignore
        const userId =
            ctx.getUser(0) ??
            ctx.getUser('user') ??
            ctx.userId;

        if (!userId) {
            return;
        }

        const user = ctx.bot.users.get(userId) ?? await ctx.bot.helpers.getUser(userId);

        if (!user) {
            await ctx.respondWith('Unkown user');
            return;
        }

        const avatar = ctx.bot.helpers.avatarURL(user.id, user.discriminator, {
            size: 2048,
            avatar: user.avatar,
        });

        await ctx.respondWith(avatar);
    }
}

export default Avatar;

new Avatar();
