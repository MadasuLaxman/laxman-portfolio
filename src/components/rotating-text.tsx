"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/** Cycles through words. Renders the first word on the server and stays put under reduced motion. */
export function RotatingText({ words, interval = 2600 }: { words: readonly string[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || words.length < 2) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % words.length), interval);
    return () => window.clearInterval(timer);
  }, [reduceMotion, words.length, interval]);

  return (
    <span className="relative inline-grid align-bottom">
      {/* Screen readers get the full list once instead of live changes. */}
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          aria-hidden="true"
          initial={{ y: "60%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-60%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
          className="text-gradient col-start-1 row-start-1 whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
