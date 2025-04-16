import { motion } from "framer-motion";
import { Home, FolderGit2, Code2, Mail } from "lucide-react";

export function Header() {
  return (
    <div className="relative">
      <motion.div
        layout
        initial={{ width: "auto" }}
        animate={{ width: "auto" }}
        className="inline-flex items-center gap-4 px-4 py-2.5 rounded-lg bg-secondary text-sm text-muted-foreground overflow-hidden font-mono"
      >
        <nav className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Home className="h-4 w-4 hidden md:block" />
            <span>home</span>
          </a>
          <span className="text-muted-foreground/20">|</span>
          <a href="/projects" className="flex items-center gap-2 hover:text-primary transition-colors">
            <FolderGit2 className="h-4 w-4 hidden md:block" />
            <span>projects</span>
          </a>
          <span className="text-muted-foreground/20">|</span>
          <a href="/skills" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Code2 className="h-4 w-4 hidden md:block" />
            <span>skills</span>
          </a>
          <span className="text-muted-foreground/20">|</span>
          <a href="/contact" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Mail className="h-4 w-4 hidden md:block" />
            <span>contact</span>
          </a>
        </nav>
      </motion.div>
    </div>
  );
}