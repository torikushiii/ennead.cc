import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Home, FolderGit2, Code2, Mail, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setTheme(isDarkMode ? 'dark' : 'light');

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'l' && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

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

        <motion.div layout className="w-[1px] h-5 bg-muted-foreground/20 flex-shrink-0" />

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                layout
                onClick={toggleTheme}
                className="p-1.5 hover:bg-secondary/50 rounded-full transition-colors relative flex-shrink-0"
                whileHover={{ scale: 1.1 }}
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