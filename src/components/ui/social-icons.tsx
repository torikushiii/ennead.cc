import { Github, Globe, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  github: Github,
  website: Globe,
  email: Mail
}

interface SocialIconsProps {
  platform: keyof typeof icons
  className?: string
  href: string
  size?: 'sm' | 'default'
}

export function SocialIcon({ platform, className, href, size = 'default' }: SocialIconsProps) {
  const Icon = icons[platform]

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "text-muted-foreground hover:text-foreground transition-colors",
        className
      )}
    >
      <Icon className={cn(
        size === 'sm' ? "h-4 w-4" : "h-5 w-5"
      )} />
    </a>
  )
}
