"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { StatusBadge } from "@/components/booking/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Users, Mail, Phone } from "lucide-react";
import { singleVenueSlug } from "@/lib/config";

const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: "Wedding",
  conference: "Conference",
  birthday: "Birthday Party",
  corporate: "Corporate Event",
  other: "Other",
};

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

  const statusUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Booking Request Received</h1>
        <p className="text-muted-foreground">
          We&apos;ll review your request and get back to you within 24 hours.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <StatusBadge status={booking.status} />
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="font-medium">{booking.eventDate}</span>
            <span className="text-muted-foreground">·</span>
            <span>{EVENT_TYPE_LABELS[booking.eventType] ?? booking.eventType}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Users className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>{booking.guestCount} guests</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>{booking.guestEmail}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>{booking.guestPhone}</span>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted-foreground mb-2">
            Save this link to check your booking status anytime:
          </p>
          <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
            <span className="text-xs font-mono break-all flex-1">{statusUrl || `/booking/${token}`}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button variant="outline" asChild>
          <Link href={`/venues/${singleVenueSlug}`}>Back to Venue</Link>
        </Button>
      </div>
    </div>
  );
}

function StatusSkeleton() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="rounded-xl border border-border p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    </div>
  );
}
