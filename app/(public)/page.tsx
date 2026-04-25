import Link from "next/link";
import Image from "next/image";
import { singleVenueSlug } from "@/lib/config";
import { Wifi, Car, Wind, Tv, ChefHat, Sparkles, Music2, Users } from "lucide-react";
import { TestimonialSection } from "@/components/landing/TestimonialSection";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  parking: <Car className="w-4 h-4" />,
  aircon: <Wind className="w-4 h-4" />,
  av_equipment: <Tv className="w-4 h-4" />,
  catering_kitchen: <ChefHat className="w-4 h-4" />,
  bridal_suite: <Sparkles className="w-4 h-4" />,
  stage: <Music2 className="w-4 h-4" />,
  dance_floor: <Users className="w-4 h-4" />,
};

const AMENITY_LABELS: Record<string, string> = {
  wifi: "Wi-Fi",
  parking: "Parking",
  aircon: "Air Conditioning",
  av_equipment: "AV Equipment",
  catering_kitchen: "Catering Kitchen",
  bridal_suite: "Bridal Suite",
  stage: "Stage",
  dance_floor: "Dance Floor",
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=85";

export default function LandingPage() {
  return <LandingContent slug={singleVenueSlug} />;
}

function LandingContent({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col">
      {/* Hero — full-bleed with gradient fade to bone */}
      <section className="relative h-[88vh] min-h-[560px] flex items-center justify-center overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="The Grand Hall KL"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-background/95" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <p className="text-white/70 text-xs font-medium tracking-[0.2em] uppercase mb-6">
            Kuala Lumpur&apos;s Premier Event Venue
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
            Where Every Event
            <br />
            Becomes <em>Unforgettable</em>
          </h1>
          <p className="text-white/80 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            The Grand Hall KL — 5,000 sq ft of elegance in the heart of KLCC.
            Weddings, galas, conferences, and milestone celebrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/venues/${slug}`}
              className="inline-flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm px-7 py-3 text-sm font-semibold text-foreground shadow-lg hover:bg-white transition-colors"
            >
              Explore the Venue
            </Link>
            <Link
              href={`/book/${slug}`}
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[0_4px_20px_rgba(154,65,0,0.35)] hover:bg-primary/90 transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="bg-card border-b border-hairline border-border">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: "Capacity", value: "500 guests" },
            { label: "Space", value: "5,000 sq ft" },
            { label: "Starting from", value: "RM 5,000/day" },
            { label: "Location", value: "KLCC, KL" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-muted/40 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-2 tracking-tight">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            World-class facilities included in every booking
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(AMENITY_LABELS).map(([key, label]) => (
              <div
                key={key}
                className="flex items-center gap-3 bg-card rounded-lg p-4 border border-hairline border-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
              >
                <span className="text-primary">{AMENITY_ICONS[key]}</span>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="py-16 px-4 max-w-6xl mx-auto w-full">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-2 tracking-tight">
          A Venue Worth Celebrating
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Stunning spaces for every occasion
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80", alt: "Grand Hall" },
            { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80", alt: "Banquet Setup" },
            { src: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&q=80", alt: "Stage" },
            { src: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80", alt: "Reception Area" },
          ].map(({ src, alt }) => (
            <div key={alt} className="relative aspect-square rounded-lg overflow-hidden group">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href={`/venues/${slug}`}
            className="inline-flex items-center justify-center rounded-full border border-hairline border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            View Full Venue
          </Link>
        </div>
      </section>

      <TestimonialSection />

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16 px-4 text-center">
        <h2 className="font-serif italic text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
          Ready to Book?
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
          Submit a booking request in minutes. Our team responds within 24 hours.
        </p>
        <Link
          href={`/book/${slug}`}
          className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary shadow-lg hover:bg-primary-foreground/90 transition-colors"
        >
          Request a Booking
        </Link>
      </section>
    </div>
  );
}
