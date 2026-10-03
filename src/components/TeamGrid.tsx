import { User } from "@phosphor-icons/react/dist/ssr";
import type { TeamMember } from "@/lib/content";

/** Kafelki Teamu ze zdjęciami (kontakt, podsumowanie po wydarzeniu). */
export default function TeamGrid({ team }: { team: TeamMember[] }) {
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {team.map((member, i) => (
        <li
          key={`${member.name}-${i}`}
          className="flex items-center gap-4 rounded-tile border border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-violet hover:shadow-md"
        >
          <div className="relative shrink-0">
            <div className="grad-brand flex size-20 items-center justify-center overflow-hidden rounded-2xl text-white sm:size-24">
              {member.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.photo}
                  alt={member.name}
                  className="size-full object-cover object-[center_60%]"
                  style={
                    member.photoPos
                      ? { objectPosition: member.photoPos }
                      : undefined
                  }
                />
              ) : (
                <User size={38} weight="duotone" />
              )}
            </div>
            {/* Emotka czapki studenckiej w rogu zdjęcia */}
            <span
              aria-hidden
              className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full border border-line bg-surface text-sm shadow-sm"
            >
              <span
                className="emoji-live"
                style={{ animationDelay: `${(i % 5) * 0.35}s` }}
              >
                🎓
              </span>
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold leading-tight">{member.name}</h3>
            <p className="mt-1 text-sm text-ink-soft">{member.role}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
