import { motion } from "framer-motion";
import { DISCORD_ID } from "@/script/constants";
import { useEffect, useState } from "react";

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  global_name: string;
  banner?: string;
  public_flags: number;
  avatar_decoration_data?: {
    asset: string;
    sku_id: string;
    expires_at: number;
  };
}

export function DiscordWidget() {
  const [userData, setUserData] = useState<DiscordUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    const fetchDiscordData = async () => {
      try {
        const response = await fetch('/api/discord/user');
        const data = await response.json();
        if (data.id) {
          setUserData(data);
        }
      } catch (error) {
        console.error('Failed to fetch Discord data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscordData();

    return () => observer.disconnect();
  }, []);

  // Return placeholder with same dimensions while loading
  if (loading) {
    return (
      <motion.div
        className="flex flex-col bg-secondary/50 rounded-lg overflow-hidden w-full max-w-[18rem] md:w-72 animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-full h-24 bg-secondary/70" />
        <div className="flex items-start gap-3 p-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-secondary/70" />
          </div>
          <div className="flex flex-col gap-2 flex-grow">
            <div className="h-4 bg-secondary/70 rounded w-24" />
            <div className="h-3 bg-secondary/70 rounded w-16" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (!userData) return null;

  const getBannerUrl = (banner: string) => {
    const isGif = banner.startsWith('a_');
    const extension = isGif ? 'gif' : 'png';
    return `https://cdn.discordapp.com/banners/${DISCORD_ID}/${banner}.${extension}?size=480`;
  };

  return (
    <motion.div
      className="flex flex-col bg-secondary/50 rounded-lg overflow-hidden w-full max-w-[18rem] md:w-72"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {userData.banner && (
        <div className="w-full h-24 relative">
          <img
            src={getBannerUrl(userData.banner)}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex items-start gap-3 p-3">
        <div className="relative flex-shrink-0">
          <img
            src={`https://cdn.discordapp.com/avatars/${DISCORD_ID}/${userData.avatar}`}
            alt={userData.username}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          {userData.avatar_decoration_data && (
            <img
              src={`https://cdn.discordapp.com/avatar-decoration-presets/${userData.avatar_decoration_data.asset}.png?size=160&passthrough=true`}
              alt="Avatar Decoration"
              className="absolute top-0 left-0 w-10 h-10"
            />
          )}
        </div>
        <div className="flex flex-col min-w-0 leading-tight">
          <span className="text-sm font-medium truncate">
            {userData.global_name || userData.username}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <img
              src={theme === 'dark' ? "/discord.png" : "/discord-black.png"}
              alt="Discord Icon"
              className="w-3 h-3"
            />
            <span>Discord</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
