import { useEffect, useState } from "react";
import { Moon, Sun, Link2, X } from "lucide-react";
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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

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

    const timeInterval = setInterval(() => {
      if (weatherData) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        setWeatherData(prev => ({
          ...prev!,
          time: `${hours}${minutes}`
        }));
      }
    }, 60000);

    const blinkInterval = setInterval(() => {
      setShowColon(prev => !prev);
    }, 1000);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'l' && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(timeInterval);
      clearInterval(blinkInterval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary/30 text-sm text-muted-foreground animate-pulse">
        <div className="w-24 h-5 bg-secondary/50 rounded" />
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
      className="inline-flex items-center gap-4 px-4 py-2.5 rounded-full bg-secondary/30 text-sm text-muted-foreground overflow-hidden font-mono"
    >
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              layout
              onClick={toggleTheme}
              className="p-1.5 hover:bg-secondary/50 rounded-full transition-colors relative flex-shrink-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-1.5 left-1.5" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Press 'L' to toggle</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <motion.div layout className="w-[1px] h-5 bg-muted-foreground/20 flex-shrink-0" />

      <motion.button
        layout="position"
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-1.5 hover:bg-secondary/50 rounded-full transition-colors flex-shrink-0"
      >
        {isExpanded ? (
          <X className="h-4 w-4" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
      </motion.button>

      <AnimatePresence mode="popLayout">
        {isExpanded && (
          <motion.div
            layout
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            <motion.a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-secondary/50 rounded-full transition-colors"
            >
              <SocialIcon platform="github" href={GITHUB_URL} size="sm" />
            </motion.a>
            <motion.a
              href={`mailto:${EMAIL}`}
              className="p-1.5 hover:bg-secondary/50 rounded-full transition-colors"
            >
              <SocialIcon platform="email" href={`mailto:${EMAIL}`} size="sm" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout="position" className="w-[1px] h-5 bg-muted-foreground/20 flex-shrink-0" />

      <motion.div layout="position" className="flex items-center text-sm flex-shrink-0">
        <span>{hours}</span>
        <span className={`${showColon ? 'opacity-100' : 'opacity-0'} transition-opacity duration-150 mx-0.5`}>
          :
        </span>
        <span>{minutes}</span>
      </motion.div>

      <AnimatePresence mode="wait">
        {weatherData.city && (
          <>
            <motion.div
              layout
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              exit={{ width: 0 }}
              className="flex items-center"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-[1px] h-5 bg-muted-foreground/20 flex-shrink-0"
              />

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                      }}
                      className="ml-4 flex-shrink-0 text-sm cursor-help"
                    >
                      {weatherData.temperature}°C
                    </motion.span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{weatherData.location}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
