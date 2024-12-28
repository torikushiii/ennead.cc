import type { APIRoute } from "astro";
import { getEnv } from "@/script/env";

export const POST: APIRoute = async ({ locals, request }) => {
  try {
    const DISCORD_WEBHOOK_URL = getEnv(locals, import.meta.env, 'DISCORD_WEBHOOK_URL');

    if (!DISCORD_WEBHOOK_URL) {
      throw new Error("Discord webhook URL is not configured");
    }

    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !message) {
      return new Response(
        JSON.stringify({ error: "Name and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const webhookBody = {
      embeds: [{
        title: "New Contact Form Submission",
        fields: [
          {
            name: "Name",
            value: name,
            inline: true
          },
          {
            name: "Email",
            value: email || "Not provided",
            inline: true
          },
          {
            name: "Message",
            value: message
          }
        ],
        color: 0x00ff00,
        timestamp: new Date().toISOString()
      }]
    };

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Discord webhook error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to send message",
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
