"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * Slot na zdjęcie, które płynnie zmienia się (crossfade) w pętli.
 * Rodzic ustala rozmiar (np. aspect-*), zdjęcia są pozycjonowane absolutnie.
 */
export default function CyclingImage({
  images,
  interval = 4200,
  className,
}: {
  images: string[];
  interval?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || images.length <= 1) return;
    const id = setInterval(
      () => setI((v) => (v + 1) % images.length),
      interval
    );
    return () => clearInterval(id);
  }, [reduce, images.length, interval]);

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <AnimatePresence initial={false}>
        <motion.img
          key={images[i]}
          src={images[i]}
          alt=""
          className="absolute inset-0 size-full object-cover"
          initial={reduce ? false : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          loading="lazy"
        />
      </AnimatePresence>
    </div>
  );
}