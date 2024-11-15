import type { APIRoute } from "astro";
import { DISCORD_BOT_TOKEN, DISCORD_ID } from "@/script/constants";

// Cache the response for 1 minute
let cachedData: any = null;
let lastFetch = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute

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

    // Cache the response
    cachedData = userData;
    lastFetch = Date.now();

    return new Response(JSON.stringify(userData), {
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
