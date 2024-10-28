import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const skillsMap = {
  "Go": {
    icon: "logos:go",
    url: "https://golang.org"
  },
  "Python": {
    icon: "logos:python",
    url: "https://python.org"
  },
  "JavaScript": {
    icon: "logos:javascript",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
  },
  "TypeScript": {
    icon: "logos:typescript-icon",
    url: "https://www.typescriptlang.org"
  },
  "Node.js": {
    icon: "logos:nodejs-icon",
    url: "https://nodejs.org"
  },
  "React": {
    icon: "logos:react",
    url: "https://react.dev"
  },
  "Astro": {
    icon: "logos:astro-icon",
    url: "https://astro.build"
  },
  "Tailwind CSS": {
    icon: "logos:tailwindcss-icon",
    url: "https://tailwindcss.com"
  },
  "MongoDB": {
    icon: "logos:mongodb-icon",
    url: "https://www.mongodb.com"
  },
  "MariaDB": {
    icon: "logos:mariadb-icon",
    url: "https://mariadb.org"
  },
  "Docker": {
    icon: "logos:docker-icon",
    url: "https://www.docker.com"
  },
  "Bash": {
    icon: "logos:bash-icon",
    url: "https://www.gnu.org/software/bash"
  },
  "Ubuntu": {
    icon: "logos:ubuntu",
    url: "https://ubuntu.com"
  },
  "Svelte": {
    icon: "logos:svelte-icon",
    url: "https://svelte.dev"
  }
} as const;

interface SkillCardProps {
  name: keyof typeof skillsMap;
}

export function SkillCard({ name }: SkillCardProps) {
  const { icon, url } = skillsMap[name];

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2 p-4 bg-secondary/30 rounded-lg border border-white/10 cursor-pointer"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Icon icon={icon} width="32" height="32" />
      <span className="text-sm font-medium">{name}</span>
    </motion.a>
  );
}
