import { motion } from "framer-motion";
import { SkillCard } from "@/components/ui/skill-card";

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
    skills: ["MongoDB", "MariaDB", "ClickHouse"]
  },
  {
    title: "Tools & Platforms",
    skills: ["Docker", "Bash", "Ubuntu"]
  }
] as const;

export function SkillsList() {
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

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="text-center space-y-12 container mx-auto px-4"
    >
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
  );
}