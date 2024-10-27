import type { APIRoute } from "astro";
import { getEnv } from "@/script/env";

let cachedData: Record<string, any> = {};
let lastFetch: Record<string, number> = {};
const CACHE_DURATION = 5 * 60 * 1000;

const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const GET: APIRoute = async ({ locals, request }) => {
  try {
    const url = new URL(request.url);
    const city = url.searchParams.get('city');

    if (!city) {
      throw new Error('City parameter is required');
    }

    // Check cache for this specific city
    if (cachedData[city] && Date.now() - (lastFetch[city] || 0) < CACHE_DURATION) {
      return new Response(JSON.stringify(cachedData[city]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const OPENWEATHER_API_KEY = getEnv(locals, import.meta.env, 'OPENWEATHER_API_KEY');

    const params = new URLSearchParams({
      q: city,
      units: 'metric',
      appid: OPENWEATHER_API_KEY
    });

    const weatherUrl = `${OPENWEATHER_BASE_URL}?${params.toString()}`;
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();

    const data = {
      city: city,
      temperature: Math.round(weatherData.main.temp)
    };

    // Cache the data for this city
    cachedData[city] = data;
    lastFetch[city] = Date.now();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Weather API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to fetch weather data'
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
