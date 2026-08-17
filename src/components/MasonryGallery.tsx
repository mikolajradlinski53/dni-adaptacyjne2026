"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type Item = { n: string; ar: number };

/**
 * Masonry z równoważeniem kolumn: każde zdjęcie trafia do najkrótszej
 * kolumny (greedy), więc kolumny są w miarę równe (również prawa strona).
 * Zdjęcia zachowują proporcje (różne wysokości) i wchodzą z animacją.
 */
export default function MasonryGallery({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(3);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      setCols(w < 520 ? 2 : 3);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Greedy: dołóż do kolumny o najmniejszej sumarycznej wysokości.
  const columns: Item[][] = Array.from({ length: cols }, () => []);
  const heights = new Array(cols).fill(0);
  for (const it of items) {
    let k = 0;
    for (let j = 1; j < cols; j++) if (heights[j] < heights[k]) k = j;
    columns[k].push(it);
    heights[k] += 1 / it.ar;
  }

  return (
    <div ref={ref} className="mt-8 flex gap-3 sm:gap-4">
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-1 flex-col gap-3 sm:gap-4">
          {col.map(({ n }, ri) => (
            <motion.div
              key={n}
              className="group overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5"
              initial={reduce ? false : { opacity: 0, y: 26, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: reduce ? 0 : (ci * 0.05 + ri * 0.08),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/web/${n}.webp`}
                alt=""
                loading="lazy"
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}