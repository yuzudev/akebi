import type { Context } from "oasis-framework";
import type { BotWithCache } from "discordeno/cache-plugin";
import { Argument, Command } from "oasis-framework";
import { hasGuildPermissions } from "discordeno/permissions-plugin";
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
        const prefix = ctx.options.getString(0) ?? ctx.options.getString("prefix");

        if (!ctx.guildId) {
            await ctx.respondPrivately({ with: "You must be in a guild to use this command" });
            return;
        }

        const currentGuild = await Prisma.guild.findUnique({
            where: {
                id: ctx.guildId,
            },
        });

        if (!prefix && currentGuild != null) {
            await ctx.respond({ with: `The current prefix is \`${currentGuild.prefix}\`` });
            return;
        }

        if (!prefix && currentGuild == null) {
            await ctx.respondPrivately({ with: "You must provide a prefix" });
            return;
        }

        if (!prefix) {
            return;
        }

        if (prefix.length > 10) {
            await ctx.respondPrivately({ with: "Prefixes cannot be longer than 10 characters" });
            return;
        }

        if (!ctx.userId) {
            return;
        }

        // check user permissions
        const member =
            ctx.bot.members.get(BigInt(`${ctx.guildId}${ctx.userId}`)) ??
            (await ctx.bot.helpers.getMember(ctx.guildId, ctx.userId));

        if (!member) {
            return;
        }

        if (!hasGuildPermissions(ctx.bot, ctx.guildId, member, ["MANAGE_GUILD"])) {
            await ctx.respondPrivately({
                with: "You must have the `MANAGE_GUILD` permission to use this command",
            });
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

        await ctx.respond({ with: `Prefix set to \`${guild?.prefix}\`` });
    }
}
