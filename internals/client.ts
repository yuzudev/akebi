import type { Bot } from '../deps/discord.ts';
import * as Discord from '../deps/discord.ts';
import * as Oasis from '../deps/oasis.ts';
import { config, handler } from './config.ts';

export type BotFn<A extends Bot, B extends Bot> = (bot: A) => B;

export class Client {
    public bot: Bot;
    public constructor() {
        if (handler) {
            const { rootDirectory, loadDirectories, temporaryFile } = handler;

            if (!loadDirectories) {
                throw new Error('handler.load is required');
            }

            if (!rootDirectory) {
                throw new Error('handler.root is required');
            }

            if (temporaryFile) {
                // import the files syncronously
                loadDirectories
                    .map((dir) => `${rootDirectory}/${dir}`)
                    .forEach(Oasis.TemporaryFileloader.importDirectory);

                // create the temp folder and load the files
                Oasis.TemporaryFileloader.fileLoader()
                    .then(() => {
                        Deno.addSignalListener('SIGINT', () => {
                            Deno.removeSync('./temp', { recursive: true });
                            Deno.exit(0);
                        });
                    })
                    .catch(() => {
                        Deno.exit(1);
                    });
            } else {
                Oasis.loadDirs(rootDirectory, loadDirectories);
            }
        }

        // use the middlewares
        const bot = Discord.createBot({
            intents: config.intents as Array<keyof typeof Discord.GatewayIntents>,
            botId: BigInt(config.botId),
            token: config.token,
            events: {},
        });

        this.bot = bot;
    }

    public use<A extends Bot, B extends Bot>(botFn: BotFn<A, B>) {
        this.bot = botFn(this.bot as A);

        return this;
    }

    public start(): Promise<void> {
        return Discord.startBot(this.bot);
    }
}
