"use client";

import { motion, useReducedMotion } from "motion/react";

type Item = { n: string; ar: number };

/**
 * Galeria „justified": zdjęcia mają różne szerokości (wg proporcji), ale
 * każdy rząd ma jednolitą wysokość i wypełnia całą szerokość - bez luk.
 * Dobre dla małej liczby zdjęć (np. harmonogram). Z animacją wejścia.
 */
export default function JustifiedGallery({ items }: { items: Item[] }) {
  const reduce = useReducedMotion();

  return (
    <div className="mt-8 flex flex-wrap gap-3 [--gh:9rem] sm:[--gh:12rem] lg:[--gh:14rem]">
      {items.map(({ n, ar }, i) => (
        <motion.div
          key={n}
          className="group overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5"
          style={{
            height: "var(--gh)",
            flexGrow: ar,
            flexBasis: `calc(var(--gh) * ${ar})`,
          }}
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 0.45,
            delay: reduce ? 0 : i * 0.09,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/web/${n}.webp`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </motion.div>
      ))}
    </div>
  );
}
