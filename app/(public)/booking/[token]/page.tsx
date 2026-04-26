"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ReceiptCard } from "@/components/booking/ReceiptCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { singleVenueSlug } from "@/lib/config";

export default function BookingStatusPage(props: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(props.params);
  const booking = useQuery(api.bookings.getByPublicToken, { token });

  if (booking === undefined) return <StatusSkeleton />;

  if (booking === null) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-2">Booking not found</h1>
        <p className="text-muted-foreground mb-6">
          This link may be invalid or expired.
        </p>
        <Button asChild>
          <Link href={`/venues/${singleVenueSlug}`}>View Venue</Link>
        </Button>
      </div>
    );
  }

  const publicStatusUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/booking/${token}`;

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <ReceiptCard
        booking={booking.booking}
        venue={booking.venue}
        publicStatusUrl={publicStatusUrl}
      />
    </main>
  );
}

function StatusSkeleton() {
  return (
    <div className="max-w-[640px] mx-auto px-4 py-12 space-y-6">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="rounded-2xl border border-border p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
      <div className="rounded-2xl border border-border p-6 space-y-3">
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
}
