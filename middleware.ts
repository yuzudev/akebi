import type { ApplicationCommandOption, Bot } from "./deps/discord.ts";
import { ApplicationCommandTypes, Context, commands, commandAliases, upsertApplicationCommands } from "./deps/discord.ts";

export function enableMiddleware(bot: Bot): Bot {
    const { interactionCreate, messageCreate, ready } = bot.events;

    bot.events.interactionCreate = (bot, interaction) => {
        if (interaction.user.toggles.bot) {
            // if is bot forward the event
            interactionCreate(bot, interaction);
            return;
        }

        const ctx = new Context("!", bot, undefined, interaction);

        // get command from cache
        const [command] = commands.get(ctx.commandName.unwrapOr(commandAliases.get(ctx.commandName.unwrapOr("")) ?? "")) ?? [];

        // check if command exists
        if (command) {
            command.run(ctx); // do not await
        }

        interactionCreate(bot, interaction);
    };

    bot.events.messageCreate = (bot, message) => {
        if (message.isBot) {
            // if is bot forward the event
            messageCreate(bot, message);
            return;
        }
        const ctx = new Context("!", bot, message, undefined);

        // get command from cache
        const [command] = commands.get(ctx.commandName.unwrapOr(commandAliases.get(ctx.commandName.unwrapOr("")) ?? "")) ?? [];

        // check if command exists
        if (command) {
            command.run(ctx); // do not await
        }

        messageCreate(bot, message);
    };

    bot.events.ready = (bot, payload, rawPayload) => {
        // TODO: do this for production only

        // register the commands against the api
        upsertApplicationCommands(bot, commands.map(([command, options]) => {
                return {
                    name: command.data.name,
                    description: command.data.description,
                    options: options as ApplicationCommandOption[],
                    type: ApplicationCommandTypes.ChatInput,
                    defaultPermission: true,
                };
            })
        );

        ready(bot, payload, rawPayload);
    };

    return bot;
}

export default enableMiddleware;