import { motion } from "framer-motion";
import { NAME, AVATAR_URL} from "@/script/constants";
import { useEffect, useState } from "react";
import { TimeWeatherWidget } from "@/components/ui/time-weather-widget";

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export function Home() {
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/github/repos');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch projects');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch projects');
        setProjects([]); // Reset projects on error
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getTopProjects = (projects: GitHubRepo[]) => {
    return [...projects]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5);
  };

  const mainSectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const mainItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="h-full">
      <section className="h-[calc(100vh-6rem)] flex items-center justify-center relative">
        <motion.div
          className="text-center space-y-8"
          variants={mainSectionVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={mainItemVariants} className="flex items-center justify-center gap-4">
            <img
              src={AVATAR_URL}
              alt={NAME}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-xl font-medium">{NAME}</span>
          </motion.div>

          <motion.h1 variants={mainItemVariants} className="text-3xl md:text-4xl font-bold px-4">
            Welcome to <span className="text-muted-foreground">my</span>
            <br />
            side of the <span className="text-muted-foreground">web.</span>
          </motion.h1>

          <motion.p variants={mainItemVariants} className="text-muted-foreground max-w-2xl px-6 text-sm md:text-base">
            Hello! I'm {NAME}, a backend developer and mostly play around with JavaScript and build automation.
            I like to create tools that make me do less clicks.
          </motion.p>

          {!loading && !error && projects.length > 0 && (
            <motion.div
              variants={mainItemVariants}
              className="max-w-md mx-auto text-left px-6"
            >
              <motion.h3
                variants={mainItemVariants}
                className="text-sm uppercase tracking-wider text-muted-foreground mb-4"
              >
                Highlighted Projects
              </motion.h3>
              <motion.div
                variants={mainSectionVariants}
                className="space-y-3"
              >
                {getTopProjects(projects).map((project) => (
                  <motion.a
                    key={project.id}
                    variants={mainItemVariants}
                    href={project.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group"
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {project.name}
                    </span>
                    <span className="text-muted-foreground">→</span>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </section>

      <motion.div
        className="fixed bottom-6 left-0 right-0 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <TimeWeatherWidget />
      </motion.div>
    </div>
  );
}
