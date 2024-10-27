import { motion } from "framer-motion";
import { 
  SiGo, 
  SiPython, 
  SiJavascript, 
  SiTypescript,
  SiNodedotjs,
  SiReact,
  SiAstro,
  SiTailwindcss,
  SiMongodb,
  SiMariadb,
  SiDocker,
  SiGnubash,
  SiUbuntu
} from "react-icons/si";

const skillsMap = {
  "Go": SiGo,
  "Python": SiPython,
  "JavaScript": SiJavascript,
  "TypeScript": SiTypescript,
  "Node.js": SiNodedotjs,
  "React": SiReact,
  "Astro": SiAstro,
  "Tailwind CSS": SiTailwindcss,
  "MongoDB": SiMongodb,
  "MariaDB": SiMariadb,
  "Docker": SiDocker,
  "Bash": SiGnubash,
  "Ubuntu": SiUbuntu
} as const;

interface SkillCardProps {
  name: keyof typeof skillsMap;
}

export function SkillCard({ name }: SkillCardProps) {
  const Icon = skillsMap[name];

  return (
    <motion.div
      className="flex flex-col items-center gap-2 p-4 bg-secondary/30 rounded-lg border border-white/10"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Icon className="w-8 h-8" />
      <span className="text-sm font-medium">{name}</span>
    </motion.div>
  );
}
