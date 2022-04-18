/**
 * @license
 * Akebi is a lightweight Discord bot that uses the Oasis framework
 * Copyright (C) 2022 Yuzuru (https://github.com/yuzudev)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * */

import { BitwisePermissionFlags } from "discordeno";
import { enableCachePlugin } from "discordeno/cache-plugin";
import { enablePermissionsPlugin } from "discordeno/permissions-plugin";
import { enableMiddleware } from "./internals/middleware.js";
import { Client } from "./internals/client.js";

// side effects
import "./internals/database.js";

// prettier-ignore
const BASE_PERMISSIONS =
      BitwisePermissionFlags.VIEW_CHANNEL
    | BitwisePermissionFlags.SEND_MESSAGES
    | BitwisePermissionFlags.EMBED_LINKS
    | BitwisePermissionFlags.ATTACH_FILES
    | BitwisePermissionFlags.READ_MESSAGE_HISTORY
    | BitwisePermissionFlags.CHANGE_NICKNAME;

const inviteUrl = (botId: bigint, perms: number) =>
    `https://discord.com/oauth2/authorize?client_id=${botId}&scope=bot%20applications.commands&permissions=${perms}`;

const client = new Client();

client.use(enableMiddleware).use(enableCachePlugin).use(enablePermissionsPlugin);

const { ready } = client.bot.events;

client.bot.events.ready = (bot, payload, rawPayload) => {
    console.info("Ready! logged as %s with id %d", payload.user.username, bot.id);
    console.info(inviteUrl(bot.id, BASE_PERMISSIONS));
    ready(bot, payload, rawPayload);
};

client.start();
