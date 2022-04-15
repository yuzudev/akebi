import type { Bot } from 'discordeno';
import type { GatewayIntents } from 'discordeno';
import { createBot, startBot } from 'discordeno';
import { config, handler } from './config.js';
import { readdirSync } from 'fs';

export type BotFn<A extends Bot, B extends Bot> = (bot: A) => B;

export interface Module {
    default: unknown;
}

export type RecAsyncGenerator<T = unknown> = AsyncGenerator<T, void | RecAsyncGenerator<T>>;

export async function* load<T extends Module>(dir: string): RecAsyncGenerator<T> {
    for (const file of readdirSync(dir)) {
        // if is a directory recursively read all of the files inside the directory/subdirectory
        if (!file.endsWith('.js')) {
            yield* load(`${dir}/${file}`);
            continue;
        }

        const mod = await import(`${process.cwd()}/${dir}/${file}`);
        yield mod as T; // yield the result
    }
}

export async function loadDirs<T extends Module>(root: string, dirs: string[]): Promise<T[]> {
    const output = [] as T[];

    for (const dir of dirs) {
        for await (const mod of load<T>(`${root}/${dir}`)) {
            output.push(mod);
        }
    }

    return output;
}

export class Client {
    public bot: Bot;
    public constructor() {
        if (handler) {
            const { rootDirectory, loadDirectories } = handler;

            if (!loadDirectories) {
                throw new Error('handler.load is required');
            }

            if (!rootDirectory) {
                throw new Error('handler.root is required');
            }

            loadDirs(rootDirectory, loadDirectories);
        }

        // use the middlewares
        const bot = createBot({
            intents: config.intents as Array<keyof typeof GatewayIntents>,
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
        return startBot(this.bot);
    }
}
