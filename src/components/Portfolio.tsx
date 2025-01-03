import { motion } from "framer-motion";
import { SocialIcon } from "@/components/ui/social-icons";
import { DiscordWidget } from "@/components/ui/discord-widget";
import { NAME, AVATAR_URL, EMAIL, GITHUB_URL, WEBSITE } from "@/script/constants";
import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/ui/project-card";
import { SkillCard } from "@/components/ui/skill-card";
import { ContactForm } from "@/components/ui/contact-form";
import { ChevronDown } from "lucide-react";
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

const skillCategories = [
  {
    title: "Languages",
    skills: ["Go", "Python", "JavaScript", "TypeScript", "Rust"]
  },
  {
    title: "Frameworks & Libraries",
    skills: ["Node.js", "React", "Astro", "Tailwind CSS", "Svelte"]
  },
  {
    title: "Databases",
    skills: ["MongoDB", "MariaDB"]
  },
  {
    title: "Tools & Platforms",
    skills: ["Docker", "Bash", "Ubuntu"]
  }
] as const;

export function Portfolio() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
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
    <div className="h-screen overflow-y-scroll hide-scrollbar">
      <section className="h-screen flex items-center justify-center relative">
        <motion.div
          className="text-center space-y-8"
          variants={mainSectionVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={mainItemVariants}>
            <TimeWeatherWidget />
          </motion.div>

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
            Hello! I'm {NAME}, a backend developer and JavaScript developer who builds automation solutions.
            I focus on creating efficient tools that solve real problems while constantly expanding my technical expertise through hands-on projects.
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

        <motion.div
          className="absolute bottom-8 w-full flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 2,
            duration: 0.5
          }}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-sm">Scroll down</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </div>
        </motion.div>
      </section>

      <section className="min-h-screen flex items-center justify-center bg-secondary/5 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center space-y-8 container mx-auto px-4"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold">
            Projects
          </motion.h2>
          {loading ? (
            <div className="text-muted-foreground">Loading projects...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : projects.length === 0 ? (
            <div className="text-muted-foreground">No projects found</div>
          ) : (
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
          )}
        </motion.div>
      </section>

      <section className="min-h-screen flex items-center justify-center py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center space-y-12 container mx-auto px-4"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold">
            Skills
          </motion.h2>
          <motion.div variants={sectionVariants} className="space-y-12">
            {skillCategories.map((category) => (
              <motion.div key={category.title} variants={itemVariants} className="space-y-4">
                <h3 className="text-xl font-semibold text-muted-foreground">
                  {category.title}
                </h3>
                <motion.div
                  variants={sectionVariants}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                >
                  {category.skills.map((skill) => (
                    <motion.div key={skill} variants={cardVariants}>
                      <SkillCard name={skill} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="min-h-screen flex items-center justify-center bg-secondary/5 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8 md:space-y-12 container mx-auto px-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold">Get in Touch</h2>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-center">
            <div className="flex flex-col gap-6 items-center md:items-start w-full md:w-auto">
              <DiscordWidget />

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-foreground transition-colors"
              >
                <SocialIcon platform="github" href={GITHUB_URL} />
                <span className="text-sm">torikushiii</span>
              </a>

              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 hover:text-foreground transition-colors"
              >
                <SocialIcon platform="email" href={`mailto:${EMAIL}`} />
                <span className="text-sm">torikushiii@proton.me</span>
              </a>
            </div>
            <div className="w-full md:w-[400px]">
              <ContactForm />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
