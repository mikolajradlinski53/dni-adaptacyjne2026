// Kolorowe, pływające poświaty w tle CAŁEJ strony (jak baner u Partnerów).
// Fixed za treścią (-z-10), jasne pastele - nie zaburzają czytelności tekstu.
const BLOBS = [
  { cls: "-left-24 top-[6%] size-[26rem] bg-magenta-soft/80", anim: "blob-a 20s" },
  { cls: "right-[-6rem] top-[20%] size-[24rem] bg-sky-soft/80", anim: "blob-b 24s" },
  { cls: "left-[18%] top-[46%] size-[30rem] bg-gold-soft/70", anim: "blob-c 27s" },
  { cls: "right-[8%] top-[64%] size-[26rem] bg-mint-soft/80", anim: "blob-a 23s" },
  { cls: "left-[-5rem] top-[82%] size-[24rem] bg-violet-soft/80", anim: "blob-b 29s" },
  { cls: "right-[24%] top-[92%] size-[22rem] bg-sky-soft/70", anim: "blob-c 25s" },
];

export default function FloatingBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {BLOBS.map((b, i) => (
        <span
          key={i}
          className={`absolute rounded-full blur-3xl ${b.cls}`}
          style={{ animation: `${b.anim} ease-in-out infinite`, animationDelay: `${i * -3}s` }}
        />
      ))}
    </div>
  );
}
