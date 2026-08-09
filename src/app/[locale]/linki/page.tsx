import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowSquareOut,
  Book,
  Buildings,
  Calendar,
  ChartBar,
  Clock,
  Coins,
  Confetti,
  FacebookLogo,
  GlobeHemisphereEast,
  GraduationCap,
  Heart,
  MicrosoftTeamsLogo,
  Monitor,
  Question,
  Scroll,
  ShieldCheck,
  Star,
  UsersThree,
  Wheelchair,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getLinks } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Stagger, RevealItem } from "@/components/Reveal";

const ICONS: Record<string, Icon> = {
  book: Book,
  shield: ShieldCheck,
  users: UsersThree,
  question: Question,
  facebook: FacebookLogo,
  confetti: Confetti,
  calendar: Calendar,
  clock: Clock,
  student: GraduationCap,
  globe: GlobeHemisphereEast,
  monitor: Monitor,
  teams: MicrosoftTeamsLogo,
  scroll: Scroll,
  star: Star,
  buildings: Buildings,
  coins: Coins,
  heart: Heart,
  chart: ChartBar,
  wheelchair: Wheelchair,
};

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata(
    locale,
    "/linki",
    t("links.title"),
    t("links.lead"),
    t("meta.siteName")
  );
}

export default async function LinksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const categories = await getLinks(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
      <h1 className="text-3xl font-extrabold sm:text-5xl">{t("links.title")}</h1>
      <p className="mt-4 max-w-xl text-ink-soft sm:text-lg">{t("links.lead")}</p>

      <div className="mt-12 space-y-14">
        {categories.map((cat) => (
          <section key={cat.category}>
            <h2 className="text-xl font-bold sm:text-2xl">{cat.category}</h2>
            <Stagger className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" gap={0.06}>
              {cat.items.map((item, i) => {
                const IconComponent = ICONS[item.icon] ?? Star;
                const accents = [
                  {
                    icon: "bg-sky-soft text-sky",
                    ring: "hover:ring-sky/40",
                    glow: "hover:shadow-sky/25",
                  },
                  {
                    icon: "bg-mint-soft text-green",
                    ring: "hover:ring-mint/40",
                    glow: "hover:shadow-mint/25",
                  },
                  {
                    icon: "bg-gold-soft text-amber",
                    ring: "hover:ring-gold/50",
                    glow: "hover:shadow-gold/30",
                  },
                  {
                    icon: "bg-violet-soft text-violet",
                    ring: "hover:ring-violet/40",
                    glow: "hover:shadow-violet/25",
                  },
                ];
                const accent = accents[i % 4];
                const inner = (
                  <>
                    <span
                      className={`link-icon flex size-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${accent.icon}`}
                      style={{ animationDelay: `${(i % 5) * 0.35}s` }}
                    >
                      <IconComponent
                        size={24}
                        weight="duotone"
                        className="transition-transform duration-300 group-hover:-rotate-[18deg] group-hover:scale-125"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <span className="truncate">{item.label}</span>
                        {item.href && !item.internal ? (
                          <ArrowSquareOut
                            size={14}
                            weight="bold"
                            className="shrink-0 text-ink-soft"
                            aria-label={t("common.external")}
                          />
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-sm text-ink-soft">
                        {item.href
                          ? (item.note ?? "")
                          : `${t("common.linkSoon")}${item.note ? ` · ${item.note}` : ""}`}
                      </span>
                    </span>
                  </>
                );
                const base =
                  "group flex h-full items-start gap-4 rounded-tile border border-line bg-surface p-5 ring-2 ring-transparent transition-all duration-300";
                const activeCls = `${base} hover:-translate-y-1.5 hover:rotate-1 hover:scale-[1.03] hover:border-violet hover:shadow-xl ${accent.ring} ${accent.glow}`;
                const disabledCls = `${base} opacity-70`;

                const card =
                  item.href && item.internal ? (
                    <Link href={item.href} className={activeCls}>
                      {inner}
                    </Link>
                  ) : item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={activeCls}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={disabledCls}>{inner}</div>
                  );

                return (
                  <div
                    key={item.label}
                    className="tile-float h-full"
                    style={{ animationDelay: `${(i % 6) * 0.4}s` }}
                  >
                    <RevealItem className="h-full" y={26}>
                      {card}
                    </RevealItem>
                  </div>
                );
              })}
            </Stagger>
          </section>
        ))}
      </div>
    </div>
  );
}
