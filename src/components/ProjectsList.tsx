import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ProjectCard } from "@/components/ui/project-card";
import { useEffect, useState } from "react";

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

export function ProjectsList() {
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
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading projects...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-muted-foreground">No projects found</div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <motion.div
        variants={sectionVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map((project) => (
          <motion.div key={project.id} variants={cardVariants}>
            <ProjectCard
              name={project.name}
              description={project.description}
              language={project.language}
              stars={project.stargazers_count}
              forks={project.forks_count}
              url={project.html_url}
              owner={project.owner}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}