"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BookingForm } from "@/components/booking/BookingForm";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";

export default function BookingPage(props: {
  params: Promise<{ venueSlug: string }>;
}) {
  const { venueSlug } = use(props.params);
  const venue = useQuery(api.venues.getBySlug, { slug: venueSlug });

  if (venue === undefined) return <BookingPageSkeleton />;

  if (venue === null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-2">Venue not found</h1>
        <Link href="/" className="text-primary underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link
        href={`/venues/${venueSlug}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to {venue.name}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Request a Booking</h1>
        <p className="text-muted-foreground">
          Fill in the details below and we&apos;ll get back to you within 24
          hours.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <BookingForm
          venueId={venue._id}
          onSuccess={(_bookingId, _publicToken) => {
            // redirect wired in Commit 10
          }}
        />
      </div>
    </div>
  );
}

function BookingPageSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col gap-6">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-5 w-1/2" />
      <div className="rounded-xl border border-border p-6 flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
