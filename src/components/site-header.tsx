"use client";

import { Download, Menu, X } from "lucide-react";
import { AnimatePresence, motion, MotionConfig, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { navItems, profile, socialLinks } from "@/content/profile";
import { GitHubIcon, LinkedInIcon } from "./brand-icons";
import { ThemeToggle } from "./theme-toggle";
import { button, buttonStyles, cn, Container } from "./ui";

const sectionIds = navItems.map((item) => item.href.replace("/#", ""));

// Tracks which home-page section is in the middle of the viewport.
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(isHome);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  // Escape closes the menu; clicking outside it closes it too.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close(true);
    }
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) close(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  // Move focus into the menu when it opens.
  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md supports-[backdrop-filter]:bg-bg/70">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-md"
            aria-label={`${profile.name}, home`}
          >
            <span
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-md border border-border-strong bg-surface font-mono text-xs font-semibold text-accent transition-colors group-hover:border-accent"
            >
              {profile.initials}
            </span>
            <span className="text-sm font-semibold tracking-tight whitespace-nowrap">{profile.name}</span>
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const id = item.href.replace("/#", "");
                const isActive = active === id;
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "relative block rounded-md px-3 py-2 text-sm transition-colors",
                        isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                      )}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="nav-active"
                          aria-hidden="true"
                          className="absolute inset-0 -z-10 rounded-md bg-surface-2"
                          transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        />
                      ) : null}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <a
              href={profile.resume.href}
              download={profile.resume.fileName}
              className={cn(button("secondary", "sm"), "max-sm:hidden")}
            >
              <Download aria-hidden="true" className="size-4" />
              Resume
            </a>
            <button
              ref={buttonRef}
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg text-fg-muted hover:bg-surface-2 hover:text-fg md:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            </button>
          </div>
        </Container>

        {/* Reading progress along the bottom edge of the header. */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute inset-x-0 -bottom-px h-px origin-left bg-gradient-to-r from-accent to-accent-2"
        />

        <AnimatePresence>
          {open ? (
            <motion.div
              ref={panelRef}
              id={menuId}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute inset-x-0 top-full border-b border-border bg-bg shadow-card md:hidden"
            >
              <Container className="py-4">
                <nav aria-label="Mobile">
                  <ul className="flex flex-col">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => close(false)}
                          className="block rounded-md px-2 py-3 text-base text-fg-muted hover:bg-surface-2 hover:text-fg"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                  <a
                    href={profile.resume.href}
                    download={profile.resume.fileName}
                    className={cn(buttonStyles.primary, "flex-1")}
                    onClick={() => close(false)}
                  >
                    <Download aria-hidden="true" className="size-4" />
                    Download resume
                  </a>
                  {socialLinks
                    .filter((link) => link.label !== "Email")
                    .map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${link.label} (opens in a new tab)`}
                        className={button("secondary", "icon")}
                      >
                        {link.label === "GitHub" ? <GitHubIcon /> : <LinkedInIcon />}
                      </a>
                    ))}
                </div>
              </Container>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}
