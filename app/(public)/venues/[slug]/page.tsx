"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { VenueHero } from "@/components/venue/VenueHero";
import { VenueGallery } from "@/components/venue/VenueGallery";
import { AmenitiesList } from "@/components/venue/AmenitiesList";
import { StickyBookingSidebar } from "@/components/venue/StickyBookingSidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function VenueDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = use(props.params);
  const venue = useQuery(api.venues.getBySlug, { slug });

  if (venue === undefined) return <VenueDetailSkeleton />;

  if (venue === null) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-2">Venue not found</h1>
        <p className="text-muted-foreground mb-6">The venue you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/" className="text-primary underline">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-10">
      {/* Gallery */}
      <VenueGallery imageUrls={venue.imageUrls ?? []} venueName={venue.name} />

      {/* Venue info + sticky booking sidebar (8/4 col on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: venue info */}
        <div className="lg:col-span-2 flex flex-col gap-0">
          <VenueHero
            name={venue.name}
            city={venue.city}
            address={venue.address}
            capacity={venue.capacity}
            pricePerDay={venue.pricePerDay}
            bookingMode={venue.bookingMode}
          />

          <section className="pt-8 mt-8 border-t border-[0.5px] border-border">
            <h2 className="font-serif text-xl font-semibold mb-3">About this space</h2>
            <p className="text-muted-foreground leading-relaxed">{venue.description}</p>
          </section>

          <section className="pt-8 mt-8 border-t border-[0.5px] border-border">
            <h2 className="font-serif text-xl font-semibold mb-4">Amenities</h2>
            <AmenitiesList amenities={venue.amenities} />
          </section>
        </div>

        {/* Right: sticky booking sidebar */}
        <div className="lg:col-span-1">
          <StickyBookingSidebar
            venueSlug={slug}
            pricePerDay={venue.pricePerDay}
            capacity={venue.capacity}
            city={venue.city}
          />
        </div>
      </div>
    </div>
  );
}

function VenueDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-10">
      <Skeleton className="h-[420px] w-full rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
