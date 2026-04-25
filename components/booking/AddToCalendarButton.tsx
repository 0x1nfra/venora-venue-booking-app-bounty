"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { generateBookingIcs } from "@/lib/ics-generator";
import { toShortId } from "@/lib/ics-generator";
import { toast } from "sonner";

interface AddToCalendarButtonProps {
  bookingId: string;
  venueName: string;
  venueAddress: string;
  eventDate: string;
  eventType: string;
  guestCount: number;
  statusUrl: string;
}

export function AddToCalendarButton(props: AddToCalendarButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const blob = await generateBookingIcs({
        bookingId: props.bookingId,
        venueName: props.venueName,
        venueAddress: props.venueAddress,
        eventDate: props.eventDate,
        eventType: props.eventType,
        guestCount: props.guestCount,
        statusUrl: props.statusUrl,
      });

      const url = URL.createObjectURL(blob);
      const shortId = toShortId(props.bookingId);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `venora-booking-${shortId}.ics`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Could not generate calendar file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} className="flex-1">
      <CalendarPlus className="w-4 h-4 mr-2" />
      {loading ? "Generating…" : "Add to Calendar"}
    </Button>
  );
}
