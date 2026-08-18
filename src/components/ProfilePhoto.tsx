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
      <div className="relative aspect-square w-full max-w-xs">
        <div className="absolute inset-[15%] overflow-hidden rounded-full shadow-card">
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
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-coral to-ink">
              <span className="font-display text-6xl font-bold text-foam/90">
                {initials}
              </span>
            </div>
          )}
        </div>
        <Image
          src="/images/window.jpg"
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 1024px) 320px, 60vw"
          className="porthole-frame pointer-events-none select-none object-contain"
        />
      </div>
      {!src && (
        <span className="rounded-full border border-dashed border-line-2 bg-surface/90 px-3 py-1 font-mono text-xs text-ink-3 backdrop-blur-sm">
          Add a photo at public/images/profile.jpg
        </span>
      )}
    </div>
  );
}
