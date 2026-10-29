"use client";

import { useEffect } from "react";

/**
 * One document-level listener that feeds the pointer position to whichever
 * `.spotlight` card is under the cursor, for the hover glow in globals.css.
 */
export function SpotlightEffect() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    function onPointerMove(event: PointerEvent) {
      const card = (event.target as Element | null)?.closest<HTMLElement>(".spotlight");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    }

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => document.removeEventListener("pointermove", onPointerMove);
  }, []);

  return null;
}
