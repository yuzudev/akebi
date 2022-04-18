import type { Context } from "oasis-framework";
import type { BotWithCache } from "discordeno/cache-plugin";
import { Argument, Command } from "oasis-framework";
import Prisma from "../../internals/database.js";

@Command
export class Prefix {
    readonly data = {
        name: "prefix",
        description: "Sets the prefix for the bot.",
    };

    readonly aliases = ["setprefix"];

    @Argument("the prefix to set", true)
    declare prefix: string;

    get options(): unknown[] {
        return [this.prefix];
    }

    async run(ctx: Context<BotWithCache>) {
        const prefix = ctx.getString(0) ?? ctx.getString("prefix");

        if (!prefix) {
            await ctx.whisper({ content: "You must provide a prefix" });
            return;
        }

        // if not in guild
        if (!ctx.guildId) {
            await ctx.whisper({ content: "You must be in a guild to use this command" });
            return;
        }

        // upsert prefix
        const guild = await Prisma.guild.upsert({
            where: {
                id: ctx.guildId,
            },
            update: {
                prefix,
            },
            create: {
                id: ctx.guildId,
                prefix,
            },
        });

        await ctx.reply({ content: `Prefix set to \`${guild?.prefix}\`` });
    }
}
