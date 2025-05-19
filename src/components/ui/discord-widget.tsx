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

  if (loading) {
    return (
      <motion.div
        className="flex flex-col bg-secondary/50 rounded-lg overflow-hidden w-full max-w-[18rem] md:w-72 animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-full h-24 bg-secondary/70" />
        <div className="flex items-start gap-1.5 p-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-secondary/70" />
          </div>
          <div className="flex flex-col gap-0.5 flex-grow">
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

  const getNameplatePath = (asset: string) => {
    return `https://cdn.discordapp.com/assets/collectibles/${asset}asset.webm`;
  };

  const getClanBadgeUrl = (badge: string, guildId: string) => {
    return `https://cdn.discordapp.com/clan-badges/${guildId}/${badge}.png?size=16`;
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
      <div className="flex items-start gap-1.5 p-3 relative">
        {userData.collectibles?.nameplate && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <video
              src={getNameplatePath(userData.collectibles.nameplate.asset)}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        )}
        <div className="relative flex-shrink-0 z-10">
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
        <div className="flex flex-col min-w-0 leading-tight z-10 w-full">
          <span className="text-sm font-medium truncate backdrop-blur-sm bg-background/30 px-1 rounded block w-fit">
            {userData.global_name || userData.username}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground backdrop-blur-sm bg-background/30 px-1 rounded mt-0.5 w-fit">
            <img
              src={theme === 'dark' ? "/discord.png" : "/discord-black.png"}
              alt="Discord Icon"
              className="w-3 h-3"
            />
            <span>Discord</span>
            {(userData.clan?.tag || userData.primary_guild?.tag) && (
              <span className="ml-0.5 bg-primary/10 px-1 rounded text-[10px] flex items-center gap-0.5">
                {userData.clan?.badge && userData.clan?.identity_guild_id && (
                  <img
                    src={getClanBadgeUrl(userData.clan.badge, userData.clan.identity_guild_id)}
                    alt="Clan Badge"
                    className="w-3 h-3"
                  />
                )}
                {userData.primary_guild?.badge && userData.primary_guild?.identity_guild_id && !userData.clan && (
                  <img
                    src={getClanBadgeUrl(userData.primary_guild.badge, userData.primary_guild.identity_guild_id)}
                    alt="Guild Badge"
                    className="w-3 h-3"
                  />
                )}
                {userData.clan?.tag || userData.primary_guild?.tag}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
