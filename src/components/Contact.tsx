import { ContactForm } from '@/components/ui/contact-form';
import { DiscordWidget } from '@/components/ui/discord-widget';
import { SocialIcon } from '@/components/ui/social-icons';
import { GITHUB_URL, EMAIL } from "@/script/constants";

export function Contact() {
  return (
    <section className="h-[calc(100vh-6rem)] flex items-center justify-center">
      <div className="text-center space-y-8 container mx-auto px-4">
        <h1 className="text-3xl font-bold">Get in Touch</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-6 text-sm md:text-base">
          Feel free to reach out to me through any of these channels.
        </p>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-center mt-12">
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
      </div>
    </section>
  );
}