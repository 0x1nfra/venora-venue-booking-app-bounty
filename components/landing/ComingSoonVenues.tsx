import { ComingSoonCard } from "@/components/landing/ComingSoonCard";

const COMING_SOON = [
  {
    name: "The Conservatory",
    location: "Penang, Malaysia",
    tagline: "Intimate weddings in a sunlit glass pavilion.",
    imageSrc: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    name: "The Vault",
    location: "Kuala Lumpur, Malaysia",
    tagline: "Private dining and brand launches with speakeasy soul.",
    imageSrc: "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=800&q=80",
  },
  {
    name: "Skyline Atelier",
    location: "Mont Kiara, KL",
    tagline: "Cocktail receptions and brand activations above the skyline.",
    imageSrc: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  },
];

export function ComingSoonVenues() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-2 tracking-tight">
          Coming Soon
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-md mx-auto">
          We&apos;re curating new spaces for our 2026 collection. Be the first to know when they&apos;re available.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {COMING_SOON.map((venue) => (
            <ComingSoonCard key={venue.name} {...venue} />
          ))}
        </div>
      </div>
    </section>
  );
}
