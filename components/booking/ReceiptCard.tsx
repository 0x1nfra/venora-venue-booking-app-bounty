"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/booking/StatusBadge";
import { AddToCalendarButton } from "@/components/booking/AddToCalendarButton";
import { Link2, Copy } from "lucide-react";
import { toShortId } from "@/lib/ics-generator";

const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: "Wedding",
  conference: "Conference",
  birthday: "Birthday Party",
  corporate: "Corporate Event",
  other: "Other",
};

interface ReceiptCardProps {
  bookingId: string;
  venueName: string;
  venueAddress: string;
  eventDate: string;
  eventType: string;
  guestCount: number;
  guestEmail: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  publicToken: string;
  statusUrl: string;
}

export function ReceiptCard(props: ReceiptCardProps) {
  const [copied, setCopied] = useState(false);
  const shortId = toShortId(props.bookingId);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(props.statusUrl);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link.");
    }
  }

  return (
    <div className="max-w-[640px] mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-8 gap-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
          Request <em>Received</em>
        </h1>
        <p className="text-muted-foreground text-sm max-w-sm">
          We&apos;ve sent the details to{" "}
          <span className="font-medium text-foreground">{props.guestEmail}</span>.
          The venue host will respond within 24 hours.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border">
        {/* Detail block */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Booking ID
            </span>
            <span className="font-mono text-sm font-semibold">#VEN-{shortId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Venue
            </span>
            <span className="text-sm font-medium">{props.venueName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Event Date
            </span>
            <span className="text-sm font-medium">{props.eventDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Event Type
            </span>
            <span className="text-sm font-medium">
              {EVENT_TYPE_LABELS[props.eventType] ?? props.eventType}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Guests
            </span>
            <span className="text-sm font-medium">{props.guestCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Status
            </span>
            <StatusBadge status={props.status} />
          </div>
        </div>

        {/* CTAs */}
        <div className="p-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <AddToCalendarButton
              bookingId={props.bookingId}
              venueName={props.venueName}
              venueAddress={props.venueAddress}
              eventDate={props.eventDate}
              eventType={EVENT_TYPE_LABELS[props.eventType] ?? props.eventType}
              guestCount={props.guestCount}
              statusUrl={props.statusUrl}
            />
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCopyLink}
            >
              {copied ? (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 mr-2" />
                  Check Status Anytime
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Save this link to check your booking status — no account needed.
          </p>
        </div>
      </div>
    </div>
  );
}
