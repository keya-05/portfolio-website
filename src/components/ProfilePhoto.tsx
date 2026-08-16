import Image from "next/image";

export default function ProfilePhoto({
  src,
  name,
}: {
  src?: string;
  name: string;
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-frame border border-line-2 shadow-card">
        {src ? (
          <Image
            src={src}
            alt={`Portrait of ${name}`}
            fill
            sizes="(min-width: 1024px) 320px, 60vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-wine to-ink">
            <span className="font-display text-7xl font-bold text-bg/90">
              {initials}
            </span>
          </div>
        )}
      </div>
      {!src && (
        <span className="rounded-full border border-dashed border-line-2 bg-surface px-3 py-1 font-mono text-xs text-ink-3">
          Add a photo at public/images/profile.jpg
        </span>
      )}
    </div>
  );
}
