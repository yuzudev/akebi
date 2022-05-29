import type { ApplicationCommandOption, Bot } from "discordeno";
import { ApplicationCommandTypes, upsertApplicationCommands } from "discordeno";
import { commands } from "oasis-framework";
import { config } from "./config.js";

export function enableMiddleware(bot: Bot) {
    const { ready } = bot.events;

    bot.events.ready = async (bot, payload, rawPayload) => {
        if (config.development) {
            // register the commands on one server
            await upsertApplicationCommands(
                bot,
                commands.map(([command, options]) => {
                    return {
                        name: command.data.name,
                        description: command.data.description,
                        options: options as ApplicationCommandOption[],
                        type: ApplicationCommandTypes.ChatInput,
                        defaultPermission: true,
                    };
                }),
                BigInt(config.supportGuildId)
            );
        } else {
            // register the commands against the api
            await upsertApplicationCommands(
                bot,
                commands.map(([command, options]) => {
                    return {
                        name: command.data.name,
                        description: command.data.description,
                        options: options as ApplicationCommandOption[],
                        type: ApplicationCommandTypes.ChatInput,
                        defaultPermission: true,
                    };
                }),
                undefined
            );
        }

        ready(bot, payload, rawPayload);
    };

    return bot;
}

export default enableMiddleware;
