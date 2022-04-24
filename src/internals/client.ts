import type { Bot } from "discordeno";
import type { GatewayIntents } from "discordeno";
import { createBot, startBot } from "discordeno";
import { config, handler } from "./config.js";
import { loadDirs } from "oasis-framework/fileloader";

export type BotFn<A extends Bot, B extends Bot> = (bot: A) => B;

export class Client<T extends Bot = Bot> {
    public bot: T;
    public constructor() {
        if (handler) {
            const { rootDirectory, loadDirectories } = handler;

            if (!loadDirectories) {
                throw new Error("handler.load is required");
            }

            if (!rootDirectory) {
                throw new Error("handler.root is required");
            }

            loadDirs(rootDirectory, loadDirectories);
        }

        // use the middlewares
        const bot = createBot({
            intents: config.intents as Array<keyof typeof GatewayIntents>,
            botId: BigInt(config.botId),
            token: config.token,
            events: {},
        }) as T;

        this.bot = bot;
    }

    public use(botFn: Function) {
        this.bot = botFn(this.bot);

        return this;
    }

    public start(): Promise<void> {
        return startBot(this.bot);
    }
}
