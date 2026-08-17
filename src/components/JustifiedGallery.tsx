"use client";

import { motion, useReducedMotion } from "motion/react";

type Item = { n: string; ar: number; full?: boolean };

/**
 * Galeria „justified": zdjęcia mają różne szerokości (wg proporcji), ale
 * każdy rząd ma jednolitą wysokość i wypełnia całą szerokość - bez luk.
 * Zdjęcia oznaczone `full` pokazujemy w CAŁOŚCI (bez kadrowania), na całą
 * szerokość - np. zrzut z transmisji live. Z animacją wejścia.
 */
export default function JustifiedGallery({ items }: { items: Item[] }) {
  const reduce = useReducedMotion();
  const grid = items.filter((x) => !x.full);
  const full = items.filter((x) => x.full);

  const enter = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: {
      duration: 0.45,
      delay: reduce ? 0 : i * 0.09,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <div className="mt-8 space-y-3 sm:space-y-4">
      {grid.length > 0 ? (
        <div className="flex flex-wrap gap-3 [--gh:9rem] sm:[--gh:12rem] lg:[--gh:14rem]">
          {grid.map(({ n, ar }, i) => (
            <motion.div
              key={n}
              className="group overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5"
              style={{
                height: "var(--gh)",
                flexGrow: ar,
                flexBasis: `calc(var(--gh) * ${ar})`,
              }}
              {...enter(i)}
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
      ) : null}

      {/* Zdjęcia „pełne" - cały kadr, bez przycinania (np. transmisja live) */}
      {full.map(({ n }, i) => (
        <motion.div
          key={n}
          className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-line bg-surface shadow-md"
          {...enter(grid.length + i)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/web/${n}.webp`}
            alt=""
            loading="lazy"
            className="h-auto w-full"
          />
        </motion.div>
      ))}
    </div>
  );
}
