import Link from "next/link";
import Image from "next/image";
import { singleVenueSlug } from "@/lib/config";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
          <Image
            src="/venora-logo.svg"
            alt="Venora"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href={`/venues/${singleVenueSlug}`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View Venue
          </Link>
          <Link
            href={`/book/${singleVenueSlug}`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
