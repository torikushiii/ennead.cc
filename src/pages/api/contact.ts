import type { APIRoute } from "astro";

const DISCORD_WEBHOOK_URL = import.meta.env.DISCORD_WEBHOOK_URL;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, message } = await request.json();

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send webhook");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Webhook Error:", error);
    return new Response(JSON.stringify({ error: "Failed to send message" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
