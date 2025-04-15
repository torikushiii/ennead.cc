import { motion, AnimatePresence } from "framer-motion";
import { Home, FolderGit2, Code2, Mail, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      <motion.div
        layout
        initial={{ width: "auto" }}
        animate={{ width: "auto" }}
        className="inline-flex items-center gap-4 px-4 py-2.5 rounded-lg bg-secondary text-sm text-muted-foreground overflow-hidden font-mono"
      >
        <nav className="hidden md:flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
            <span>home</span>
          </a>
          <span className="text-muted-foreground/20">|</span>
          <a href="/projects" className="flex items-center gap-2 hover:text-primary transition-colors">
            <FolderGit2 className="h-4 w-4" />
            <span>projects</span>
          </a>
          <span className="text-muted-foreground/20">|</span>
          <a href="/skills" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Code2 className="h-4 w-4" />
            <span>skills</span>
          </a>
          <span className="text-muted-foreground/20">|</span>
          <a href="/contact" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Mail className="h-4 w-4" />
            <span>contact</span>
          </a>
        </nav>

        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center gap-2 hover:text-primary transition-colors"
        >
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span>menu</span>
        </button>
      </motion.div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 rounded-lg bg-secondary md:hidden z-50"
          >
            <nav className="flex flex-col space-y-3">
              <a href="/"
                className="flex items-center gap-2 hover:text-primary transition-colors p-2 rounded-md hover:bg-secondary/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>home</span>
              </a>
              <a href="/projects"
                className="flex items-center gap-2 hover:text-primary transition-colors p-2 rounded-md hover:bg-secondary/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <FolderGit2 className="h-4 w-4" />
                <span>projects</span>
              </a>
              <a href="/skills"
                className="flex items-center gap-2 hover:text-primary transition-colors p-2 rounded-md hover:bg-secondary/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Code2 className="h-4 w-4" />
                <span>skills</span>
              </a>
              <a href="/contact"
                className="flex items-center gap-2 hover:text-primary transition-colors p-2 rounded-md hover:bg-secondary/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Mail className="h-4 w-4" />
                <span>contact</span>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}