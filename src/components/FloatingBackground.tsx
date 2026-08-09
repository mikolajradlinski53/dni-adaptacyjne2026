// Kolorowe, pływające poświaty w tle CAŁEJ strony (jak baner u Partnerów).
// Fixed za treścią (-z-10), jasne pastele - nie zaburzają czytelności tekstu.
const BLOBS = [
  { cls: "-left-24 top-[5%] size-[28rem] bg-magenta-soft/90", anim: "blob-a 20s" },
  { cls: "right-[-6rem] top-[18%] size-[26rem] bg-sky-soft/90", anim: "blob-b 24s" },
  { cls: "left-[16%] top-[44%] size-[32rem] bg-gold-soft/85", anim: "blob-c 27s" },
  { cls: "right-[6%] top-[62%] size-[28rem] bg-mint-soft/90", anim: "blob-a 23s" },
  { cls: "left-[-5rem] top-[80%] size-[26rem] bg-violet-soft/90", anim: "blob-b 29s" },
  { cls: "right-[22%] top-[92%] size-[24rem] bg-sky-soft/85", anim: "blob-c 25s" },
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
