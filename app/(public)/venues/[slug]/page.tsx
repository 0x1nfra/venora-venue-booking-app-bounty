"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { VenueHero } from "@/components/venue/VenueHero";
import { VenueGallery } from "@/components/venue/VenueGallery";
import { AmenitiesList } from "@/components/venue/AmenitiesList";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/config";

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

      {/* Hero info + Book Now (two-column on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: venue info */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <VenueHero
            name={venue.name}
            city={venue.city}
            address={venue.address}
            capacity={venue.capacity}
            pricePerDay={venue.pricePerDay}
            bookingMode={venue.bookingMode}
          />

          <section>
            <h2 className="text-xl font-semibold mb-3">About this venue</h2>
            <p className="text-muted-foreground leading-relaxed">{venue.description}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <AmenitiesList amenities={venue.amenities} />
          </section>
        </div>

        {/* Right: booking card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-5">
            <div>
              <p className="text-2xl font-bold">{formatPrice(venue.pricePerDay)}</p>
              <p className="text-sm text-muted-foreground">per day · full-day booking</p>
            </div>
            <ul className="text-sm text-muted-foreground flex flex-col gap-2">
              <li className="flex items-center justify-between">
                <span>Capacity</span>
                <span className="font-medium text-foreground">Up to {venue.capacity.toLocaleString()} guests</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Location</span>
                <span className="font-medium text-foreground">{venue.city}</span>
              </li>
            </ul>
            <Button asChild size="lg" className="w-full">
              <Link href={`/book/${slug}`}>Book Now</Link>
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              No payment needed to request — we&apos;ll confirm within 24 hours.
            </p>
          </div>
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
