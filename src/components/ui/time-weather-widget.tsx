import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SocialIcon } from "@/components/ui/social-icons";
import { GITHUB_URL, EMAIL } from "@/script/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface WeatherData {
  city: string;
  temperature: number;
  time: string;
  location?: string;
}

export function TimeWeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showColon, setShowColon] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationResponse = await fetch('https://ipapi.co/json/');
        if (!locationResponse.ok) {
          throw new Error('Failed to get location');
        }

        const locationData = await locationResponse.json();
        if (locationData.error || !locationData.city) {
          throw new Error(locationData.error || 'No city found');
        }

        const weatherResponse = await fetch(`/api/weather?city=${encodeURIComponent(locationData.city)}`);
        if (!weatherResponse.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const weatherData = await weatherResponse.json();

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        setWeatherData({
          city: weatherData.city,
          temperature: weatherData.temperature,
          time: `${hours}${minutes}`,
          location: `${locationData.city}, ${locationData.country_name}` // Add formatted location
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Just set the time if weather data fails
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        setWeatherData({
          city: '',
          temperature: 0,
          time: `${hours}${minutes}`,
          location: ''
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');

      setWeatherData(prev => ({
        ...prev!,
        time: `${hours}${minutes}`
      }));
    };

    const setupTimerSync = () => {
      updateTime();

      const now = new Date();
      const millisTillNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

      const timeoutId = setTimeout(() => {
        updateTime();
        const intervalId = setInterval(updateTime, 60000);
        return () => clearInterval(intervalId);
      }, millisTillNextMinute);

      return () => clearTimeout(timeoutId);
    };

    const cleanupTimer = setupTimerSync();
    const blinkInterval = setInterval(() => {
      setShowColon(prev => !prev);
    }, 1000);

    return () => {
      if (cleanupTimer) cleanupTimer();
      clearInterval(blinkInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="inline-flex items-center gap-4 px-4 py-2.5 rounded-lg bg-secondary text-sm text-muted-foreground overflow-hidden font-mono">
        <div className="w-12 h-5 bg-secondary/50 rounded animate-pulse" />
        <div className="w-[1px] h-5 bg-muted-foreground/20 flex-shrink-0" />
        <div className="w-20 h-5 bg-secondary/50 rounded animate-pulse" />
        <div className="w-[1px] h-5 bg-muted-foreground/20 flex-shrink-0 hidden xs:block" />
        <div className="w-20 h-5 bg-secondary/50 rounded animate-pulse hidden xs:block" />
        <div className="w-[1px] h-5 bg-muted-foreground/20 flex-shrink-0" />
        <div className="w-8 h-5 bg-secondary/50 rounded animate-pulse" />
      </div>
    );
  }

  if (!weatherData) return null;

  const hours = weatherData.time.slice(0, 2);
  const minutes = weatherData.time.slice(2, 4);

  return (
    <motion.div
      layout
      initial={{ width: "auto" }}
      animate={{ width: "auto" }}
      className="inline-flex items-center gap-4 px-4 py-2.5 rounded-lg bg-secondary text-sm text-muted-foreground overflow-hidden font-mono"
    >
      <motion.div layout="position" className="flex items-center text-sm flex-shrink-0">
        <span>{hours}</span>
        <span className={`${showColon ? 'opacity-100' : 'opacity-0'} transition-opacity duration-150 mx-0.5`}>
          :
        </span>
        <span>{minutes}</span>
      </motion.div>

      <motion.div layout className="w-[1px] h-5 bg-muted-foreground/20 flex-shrink-0" />

      <AnimatePresence mode="wait">
        {weatherData.city && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <span className="flex-shrink-0">{weatherData.temperature}°C</span>
            {weatherData.location && (
              <span className="text-xs text-muted-foreground/60 hidden sm:inline-block">
                {weatherData.location}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="w-[1px] h-5 bg-muted-foreground/20 flex-shrink-0 hidden xs:block" />

      <div className="flex items-center gap-3 hidden xs:flex">
        <motion.a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 hover:bg-secondary/50 rounded-full transition-colors"
          whileHover={{ scale: 1.1 }}
        >
          <SocialIcon platform="github" href={GITHUB_URL} size="sm" />
        </motion.a>
        <motion.a
          href={`mailto:${EMAIL}`}
          className="p-1.5 hover:bg-secondary/50 rounded-full transition-colors"
          whileHover={{ scale: 1.1 }}
        >
          <SocialIcon platform="email" href={`mailto:${EMAIL}`} size="sm" />
        </motion.a>
      </div>
    </motion.div>
  );
}
