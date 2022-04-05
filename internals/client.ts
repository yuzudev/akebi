import type { Bot, CreateBotOptions } from '../deps/discord.ts';
import * as Discord from '../deps/discord.ts';
import * as Oasis from '../deps/oasis.ts';
import { Config } from './config.ts';

export interface OasisOptions extends Omit<CreateBotOptions, 'events' | 'botId' | 'token' | 'intents'> {
    plugins?: Function[];
    events?: CreateBotOptions['events'];
    handler?: {
        root?: string;
        load?: string[];
        temp?: boolean;
    };
}

export function createBot(options: OasisOptions) {
    if (options.handler) {
        const { root, load, temp } = options.handler;

        if (!load) {
            throw new Error('handler.load is required');
        }

        if (!root) {
            throw new Error('handler.root is required');
        }

        if (temp) {
            // import the files syncronously
            load.map((dir) => `${root}/${dir}`)
                .forEach(Oasis.TemporaryFileloader.importDirectory);

            // create the temp folder and load the files
            Oasis.TemporaryFileloader.fileLoader()
                .then(() => {
                    Deno.addSignalListener("SIGINT", () => {
                        Deno.removeSync('./temp', { recursive: true });
                        Deno.exit(0);
                    });
                })
                .catch(() => {
                    Deno.exit(1);
                });
        } else {
            Oasis.loadDirs(root, load);
        }
    }

    // use the middlewares
    const bot = Discord.createBot({
        intents: Config.intents as Array<keyof typeof Discord.GatewayIntents>,
        botId: BigInt(Config.botId),
        token: Config.token,
        events: options.events ?? {},
    });

    return options.plugins?.reduce((bot, plugin) => plugin(bot), bot) ?? bot;
}

export function startBot(bot: Bot) {
    return Discord.startBot(bot);
}
