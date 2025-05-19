import type { APIRoute } from "astro";
import { DISCORD_BOT_TOKEN, DISCORD_ID } from "@/script/constants";

interface DiscordResponse {
  id: string;
  username: string;
  avatar: string;
  global_name: string | null;
  banner?: string;
  avatar_decoration_data?: {
    asset: string;
    sku_id: string;
    expires_at: number;
  };
  clan?: {
    identity_guild_id: string;
    identity_enabled: boolean;
    tag: string;
    badge: string;
  };
  primary_guild?: {
    identity_guild_id: string;
    identity_enabled: boolean;
    tag: string;
    badge: string;
  };
  collectibles?: {
    nameplate: {
      sku_id: string;
      asset: string;
    };
  };
}

let cachedData: DiscordResponse | null = null;
let lastFetch = 0;
const CACHE_DURATION = 60 * 60 * 5000;

export const GET: APIRoute = async () => {
  try {
    if (cachedData && Date.now() - lastFetch < CACHE_DURATION) {
      return new Response(JSON.stringify(cachedData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const response = await fetch(`https://discord.com/api/v10/users/${DISCORD_ID}`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Discord API returned ${response.status}`);
    }

    const userData = await response.json();

    const filteredData: DiscordResponse = {
      id: userData.id,
      username: userData.username,
      avatar: userData.avatar,
      global_name: userData.global_name,
      banner: userData.banner,
      avatar_decoration_data: userData.avatar_decoration_data,
      clan: userData.clan,
      collectibles: userData.collectibles,
      primary_guild: userData.primary_guild,
    };

    cachedData = filteredData;
    lastFetch = Date.now();

    return new Response(JSON.stringify(filteredData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Discord API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch Discord data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
