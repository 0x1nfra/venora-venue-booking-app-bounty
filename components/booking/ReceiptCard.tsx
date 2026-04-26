import { Doc } from "@/convex/_generated/dataModel";
import { format } from "date-fns";
import { StatusBadge } from "@/components/booking/StatusBadge";
import { AddToCalendarButton } from "./AddToCalendarButton";
import { CopyStatusLinkButton } from "./CopyStatusLinkButton";
import { toShortBookingId } from "@/lib/short-id";

interface Props {
  booking: Doc<"bookings">;
  venue: Doc<"venues">;
  publicStatusUrl: string;
}

export function ReceiptCard({ booking, venue, publicStatusUrl }: Props) {
  const shortId = toShortBookingId(booking._id);
  const formattedDate = format(new Date(booking.eventDate), "EEEE, d MMMM yyyy");

  return (
    <article
      className="w-full max-w-2xl mx-auto bg-card
                 border border-border rounded-2xl
                 shadow-sm p-6 md:p-10"
    >
      {/* Header */}
      <header className="text-center mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
          Concierge Confirmation
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Request <em className="text-primary not-italic">Received</em>
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We&rsquo;ve sent the details to{" "}
          <span className="text-foreground font-medium">{booking.guestEmail}</span>. The
          venue host will respond within 24 hours.
        </p>
      </header>

      <div className="border-t border-border my-6" />

      {/* Detail block */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <DetailRow label="Booking ID" value={shortId} mono />
        <DetailRow label="Status">
          <StatusBadge status={booking.status} />
        </DetailRow>
        <DetailRow label="Venue" value={venue.name} />
        <DetailRow label="Event Date" value={formattedDate} />
        <DetailRow label="Event Type" value={formatEventType(booking.eventType)} />
        <DetailRow label="Estimated Guests" value={String(booking.guestCount)} />
      </dl>

      <div className="border-t border-border my-6" />

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <AddToCalendarButton
          shortId={shortId}
          venueName={venue.name}
          venueAddress={venue.address}
          eventType={booking.eventType}
          eventDate={booking.eventDate}
          guestCount={booking.guestCount}
          guestName={booking.guestName}
          status={booking.status}
          publicStatusUrl={publicStatusUrl}
        />
        <CopyStatusLinkButton url={publicStatusUrl} />
      </div>

      <p className="text-xs text-muted-foreground text-center mt-6 max-w-md mx-auto">
        Save this link to check your booking status at any time. We&rsquo;ll
        also email you when the venue host responds.
      </p>
    </article>
  );
}

interface DetailRowProps {
  label: string;
  value?: string;
  mono?: boolean;
  children?: React.ReactNode;
}

function DetailRow({ label, value, mono, children }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className={mono ? "font-mono text-sm text-foreground" : "text-sm text-foreground"}>
        {children ?? value}
      </dd>
    </div>
  );
}

function formatEventType(raw: string): string {
  const map: Record<string, string> = {
    wedding: "Wedding Reception",
    corporate: "Corporate Retreat",
    private_dining: "Private Dining",
    brand_launch: "Brand Launch",
    other: "Private Event",
  };
  return map[raw] ?? raw;
}
