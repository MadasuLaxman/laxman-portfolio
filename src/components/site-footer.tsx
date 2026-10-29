import { Mail } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { navItems, profile, socialLinks } from "@/content/profile";
import { GitHubIcon, LinkedInIcon } from "./brand-icons";
import { Container } from "./ui";

const icons = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  Email: (props: { size?: number }) => <Mail aria-hidden="true" size={props.size ?? 18} />,
};

// Cache Components needs time-dependent values to be cached or deferred explicitly.
async function CurrentYear() {
  "use cache";
  cacheLife("weeks");
  return new Date().getFullYear();
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10">
      <Container className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-tight">{profile.name}</p>
          <p className="mt-1 text-sm text-fg-muted">
            {profile.role} · {profile.location}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-fg-muted transition-colors hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex gap-1" aria-label="Profiles">
          {socialLinks.map((link) => {
            const Icon = icons[link.label];
            const external = link.label !== "Email";
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={external ? `${link.label} (opens in a new tab)` : `Email ${profile.email}`}
                  className="inline-flex size-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  <Icon size={17} />
                </a>
              </li>
            );
          })}
        </ul>
      </Container>
      <Container className="mt-8">
        <p className="font-mono text-xs text-fg-subtle">
          © <CurrentYear /> {profile.name}. Built with Next.js and Tailwind CSS.
        </p>
      </Container>
    </footer>
  );
}
