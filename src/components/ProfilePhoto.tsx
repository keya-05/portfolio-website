import Image from "next/image";

export default function ProfilePhoto({
  src,
  name,
}: {
  src?: string;
  name: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-[28px] border border-wine/15 bg-photo-bg shadow-card">
        {src && (
          <Image
            src={src}
            alt={`Portrait of ${name}`}
            fill
            sizes="(min-width: 1024px) 400px, 80vw"
            className="object-cover"
            priority
          />
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
