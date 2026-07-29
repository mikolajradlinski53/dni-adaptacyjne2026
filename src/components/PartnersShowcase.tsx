"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Sparkle } from "@phosphor-icons/react";
import type { Partner } from "@/lib/content";

export default function PartnersShowcase({
  partners,
  comingSoon,
  visitSite,
}: {
  partners: Partner[];
  comingSoon: string;
  visitSite: string;
}) {
  const reduce = useReducedMotion();
  const strategic = partners.filter((p) => p.tier === "strategic");
  const regular = partners.filter((p) => p.tier !== "strategic");
  const placeholderCount = Math.max(0, 8 - regular.length);

  // Delikatne „skakanie" kafli — różne fazy, żeby ruszały się niezależnie.
  const bob = (i: number) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -8, 0] },
          transition: {
            duration: 3 + (i % 3) * 0.5,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: (i % 4) * 0.25,
          },
        };

  return (
    <div className="space-y-8">
      {/* Wyróżnieni partnerzy (większa, animowana karta) */}
      {strategic.map((p) => (
        <div key={p.name} className="relative">
          <div
            aria-hidden
            className="partner-glow grad-brand absolute -inset-[3px] rounded-[1.45rem] opacity-70 blur-[3px]"
          />
          <a
            href={p.href ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex flex-col items-start gap-6 rounded-tile border border-line bg-surface p-6 transition-transform hover:scale-[1.01] sm:flex-row sm:items-center sm:p-8"
          >
            <div className="flex h-20 w-52 shrink-0 items-center justify-center rounded-2xl bg-blue-soft/50">
              {p.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.logo}
                  alt={p.name}
                  className="max-h-14 w-auto max-w-[75%] object-contain"
                />
              ) : (
                <span className="text-2xl font-extrabold">{p.name}</span>
              )}
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet">
                <Sparkle size={13} weight="fill" />
                Partner
              </span>
              {p.desc ? (
                <p className="mt-3 text-ink-soft">{p.desc}</p>
              ) : null}
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-violet">
                {visitSite}
                <ArrowUpRight size={16} weight="bold" />
              </span>
            </div>
          </a>
        </div>
      ))}

      {/* Pozostali partnerzy + sloty „wkrótce" */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {regular.map((p, i) => (
          <motion.a
            key={p.name}
            href={p.href ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={p.name}
            title={p.desc ?? p.name}
            {...bob(i)}
            className="group flex aspect-[3/2] items-center justify-center rounded-tile border border-line bg-surface p-6 transition-all hover:border-violet hover:shadow-md"
          >
            {p.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.logo}
                alt={p.name}
                className="max-h-10 w-auto max-w-[80%] object-contain transition-transform group-hover:scale-105"
              />
            ) : (
              <span className="text-center font-semibold text-ink">{p.name}</span>
            )}
          </motion.a>
        ))}

        {Array.from({ length: placeholderCount }).map((_, i) => (
          <motion.div
            key={`ph-${i}`}
            {...bob(regular.length + i)}
            className="shimmer flex aspect-[3/2] flex-col items-center justify-center gap-2 rounded-tile border border-dashed border-line bg-surface"
          >
            <span className="grad-brand size-8 rounded-full opacity-25" />
            <span className="text-xs font-medium text-ink-soft/70">
              {comingSoon}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}