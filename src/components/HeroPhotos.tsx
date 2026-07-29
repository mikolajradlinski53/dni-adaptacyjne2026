"use client";

import { motion, useReducedMotion } from "motion/react";
import CyclingImage from "./CyclingImage";

const EASE = [0.22, 1, 0.36, 1] as const;
const web = (n: string) => `/images/web/${n}.webp`;

type Slot = {
  images: string[];
  className: string;
  rotate: number;
  float: number;
  duration: number;
  delay: number;
  interval: number;
};

// Trzy kadry, każdy rotuje inny zestaw zdjęć — dzięki różnym interwałom
// zmieniają się pojedynczo, tworząc wciąż nowe kombinacje.
const SLOTS: Slot[] = [
  {
    images: ["main3", "main4", "main9", "main13"].map(web),
    className: "left-0 top-[6%] w-[68%] aspect-[4/3] z-20",
    rotate: -3,
    float: 10,
    duration: 5.2,
    delay: 0.1,
    interval: 4200,
  },
  {
    images: ["main12", "main5", "main8", "main2"].map(web),
    className: "right-0 top-0 w-[42%] aspect-[3/4] z-30",
    rotate: 4,
    float: -12,
    duration: 6,
    delay: 0.22,
    interval: 5300,
  },
  {
    images: ["main10", "main6", "main11", "main7"].map(web),
    className: "bottom-0 right-[8%] w-[58%] aspect-[4/3] z-10",
    rotate: 3,
    float: 9,
    duration: 5.6,
    delay: 0.34,
    interval: 4700,
  },
];

export default function HeroPhotos() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none">
      {/* Miękka poświata w tle kolażu */}
      <div
        aria-hidden
        className="absolute inset-4 -z-10 rounded-full bg-gradient-to-br from-blue-soft via-violet-soft to-magenta-soft blur-2xl"
      />

      {SLOTS.map((slot) => (
        <motion.div
          key={slot.className}
          className={`absolute overflow-hidden rounded-2xl bg-surface shadow-xl ring-1 ring-black/5 ${slot.className}`}
          initial={
            reduce
              ? false
              : { opacity: 0, y: 24, scale: 0.92, rotate: slot.rotate }
          }
          animate={
            reduce
              ? { rotate: slot.rotate }
              : {
                  opacity: 1,
                  y: [0, slot.float, 0],
                  scale: 1,
                  rotate: slot.rotate,
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  opacity: { duration: 0.6, delay: slot.delay, ease: EASE },
                  scale: { duration: 0.6, delay: slot.delay, ease: EASE },
                  rotate: { duration: 0.6, delay: slot.delay, ease: EASE },
                  y: {
                    duration: slot.duration,
                    delay: slot.delay + 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
          }
        >
          <CyclingImage
            images={slot.images}
            interval={slot.interval}
            className="size-full"
          />
        </motion.div>
      ))}
    </div>
  );
}