import Link from "next/link";
import { singleVenueSlug } from "@/lib/config";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-hairline border-border shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif italic text-xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
        >
          Venora
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href={`/venues/${singleVenueSlug}`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Venues
          </Link>
          <Link
            href={`/book/${singleVenueSlug}`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Concierge
          </Link>
          <Link
            href={`/book/${singleVenueSlug}`}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_4px_14px_rgba(154,65,0,0.25)] hover:bg-primary/90 transition-colors"
          >
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
