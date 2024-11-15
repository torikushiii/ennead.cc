import { motion } from "framer-motion";
import { Star, GitFork } from "lucide-react";
import languageColors from "@/script/languageColors.json";

interface ProjectCardProps {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export function ProjectCard({ name, description, language, stars, forks, url, owner }: ProjectCardProps) {
  const languageColor = language ? languageColors[language] || "#858585" : "#858585";

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 md:p-6 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors border border-white/10"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        <img
          src={owner.avatar_url}
          alt={owner.login}
          className="w-5 h-5 md:w-6 md:h-6 rounded-full"
        />
        <span className="text-xs md:text-sm font-medium">{owner.login}</span>
      </div>
      <h3 className="text-base md:text-lg font-semibold mb-2">{name}</h3>
      <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 line-clamp-2">{description}</p>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {language && (
          <span className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: languageColor }}
            />
            {language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          {stars}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="w-4 h-4" />
          {forks}
        </span>
      </div>
    </motion.a>
  );
}
