"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Shot = {
  src: string;
  className: string;
  rotate: number;
  float: number;
  duration: number;
  delay: number;
};

// Kolaż zdjęć z wydarzenia. Kadry lekko poprzesuwane, delikatnie „oddychają".
const SHOTS: Shot[] = [
  {
    src: "/images/web/main3.webp",
    className: "left-0 top-[6%] w-[68%] aspect-[4/3] z-20",
    rotate: -3,
    float: 10,
    duration: 5.2,
    delay: 0.1,
  },
  {
    src: "/images/web/main12.webp",
    className: "right-0 top-0 w-[42%] aspect-[3/4] z-30",
    rotate: 4,
    float: -12,
    duration: 6,
    delay: 0.22,
  },
  {
    src: "/images/web/main10.webp",
    className: "bottom-0 right-[8%] w-[58%] aspect-[4/3] z-10",
    rotate: 3,
    float: 9,
    duration: 5.6,
    delay: 0.34,
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

      {SHOTS.map((shot, i) => (
        <motion.div
          key={shot.src}
          className={`absolute overflow-hidden rounded-2xl bg-surface shadow-xl ring-1 ring-black/5 ${shot.className}`}
          initial={
            reduce
              ? false
              : { opacity: 0, y: 24, scale: 0.92, rotate: shot.rotate }
          }
          animate={
            reduce
              ? { rotate: shot.rotate }
              : {
                  opacity: 1,
                  y: [0, shot.float, 0],
                  scale: 1,
                  rotate: shot.rotate,
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  opacity: { duration: 0.6, delay: shot.delay, ease: EASE },
                  scale: { duration: 0.6, delay: shot.delay, ease: EASE },
                  rotate: { duration: 0.6, delay: shot.delay, ease: EASE },
                  y: {
                    duration: shot.duration,
                    delay: shot.delay + 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shot.src}
            alt=""
            className="size-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
        </motion.div>
      ))}
    </div>
  );
}