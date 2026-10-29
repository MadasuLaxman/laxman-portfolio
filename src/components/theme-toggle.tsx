"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore, type MouseEvent } from "react";
import { cn } from "./ui";

type Theme = "light" | "dark";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function savedTheme(): string | null {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  // null on the server, so the label is only rendered once the real theme is known.
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null);
  const next: Theme = theme === "light" ? "dark" : "light";

  // Follow the OS setting until the visitor picks a theme themselves.
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: light)");
    function onSystemChange() {
      if (!savedTheme()) document.documentElement.dataset.theme = query.matches ? "light" : "dark";
    }
    query.addEventListener("change", onSystemChange);
    return () => query.removeEventListener("change", onSystemChange);
  }, []);

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {
        // Storage can be unavailable (private mode); the theme still applies for this visit.
      }
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion) {
      apply();
      return;
    }

    // Reveal the new theme as a circle growing from the button.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 600, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {
        // The transition was skipped; the theme is already applied.
      });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme ? `Switch to ${next} theme` : "Toggle color theme"}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg",
        className,
      )}
    >
      {/* Both icons render; CSS shows the one matching the current theme. */}
      <Sun aria-hidden="true" className="hidden size-[18px] dark:block" />
      <Moon aria-hidden="true" className="block size-[18px] dark:hidden" />
    </button>
  );
}
