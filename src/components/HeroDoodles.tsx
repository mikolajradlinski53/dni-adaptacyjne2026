import {
  BookOpen,
  Coffee,
  GraduationCap,
  Confetti,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";

/**
 * Subtelna warstwa dekoracyjna w duchu motywu DA (bloby + akademickie „doodle").
 * Gra „drugie skrzypce": niska widoczność, tło, pointer-events wyłączone.
 */
export default function HeroDoodles() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Miękkie bloby */}
      <span className="absolute -left-16 top-1/4 size-52 rounded-full bg-magenta-soft/50 blur-3xl" />
      <span className="absolute -right-12 -top-10 size-56 rounded-full bg-blue-soft/50 blur-3xl" />
      <span className="absolute bottom-[-4rem] left-1/3 size-56 rounded-full bg-gold-soft/50 blur-3xl" />

      {/* Akademickie doodle */}
      <BookOpen
        weight="duotone"
        className="absolute left-[3%] top-[16%] size-12 -rotate-12 text-magenta/15 sm:size-16"
      />
      <Coffee
        weight="duotone"
        className="absolute right-[5%] top-[14%] size-11 rotate-12 text-violet/15 sm:size-14"
      />
      <GraduationCap
        weight="duotone"
        className="absolute bottom-[12%] left-[8%] size-12 rotate-6 text-mint/25 sm:size-16"
      />
      <Confetti
        weight="duotone"
        className="absolute bottom-[16%] right-[9%] size-11 -rotate-6 text-gold/30 sm:size-14"
      />
      <Sparkle
        weight="fill"
        className="absolute right-[22%] top-[42%] size-6 text-magenta/20"
      />
    </div>
  );
}