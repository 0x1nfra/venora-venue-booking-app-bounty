import Image from "next/image";

interface ComingSoonCardProps {
  name: string;
  location: string;
  tagline: string;
  imageSrc: string;
}

export function ComingSoonCard({ name, location, tagline, imageSrc }: ComingSoonCardProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card opacity-80">
      <div className="relative aspect-[4/3]">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover saturate-50"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <span className="absolute top-3 right-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold tracking-wide text-foreground">
          Coming Soon
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-foreground/70">{name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{location}</p>
        <p className="text-xs text-muted-foreground mt-2 italic">{tagline}</p>
      </div>
    </div>
  );
}
