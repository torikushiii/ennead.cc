import type { APIRoute } from "astro";
import { getEnv } from "@/script/env";

// Cache the response for 5 minutes
let cachedData: any = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const REPO_URLS = [
  "repos/torikushiii/BlueArchiveAPI",
  "repos/torikushiii/starrail-auto",
  "repos/torikushiii/hoyolab-auto",
  "repos/torikushiii/DiscordTwitterBot",
  "repos/torikushiii/HonkaiStarRailAPI",
  "repos/torikushiii/youtube-archive",
  "repos/torikushiii/uploader",
  "repos/torikushiii/levelinfinite"
];

export const GET: APIRoute = async ({ locals }) => {
  try {
    const GITHUB_TOKEN = getEnv(locals, import.meta.env, 'GITHUB_TOKEN');

    if (!GITHUB_TOKEN) {
      throw new Error('GitHub token not configured');
    }

    if (cachedData && Date.now() - lastFetch < CACHE_DURATION) {
      return new Response(JSON.stringify(cachedData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const repos = await Promise.all(
      REPO_URLS.map(async (url) => {
        const response = await fetch(`https://api.github.com/${url}`, {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`, 
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'ennead'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`GitHub API error for ${url}:`, errorText);
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
      })
    );

    // Cache the response
    cachedData = repos;
    lastFetch = Date.now();

    return new Response(JSON.stringify(repos), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('GitHub API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to fetch GitHub data'
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
