"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { downloadBookingIcs } from "@/lib/ics-generator";
import { toast } from "sonner";

interface Props {
  shortId: string;
  venueName: string;
  venueAddress: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  guestName: string;
  status: string;
  publicStatusUrl: string;
}

export function AddToCalendarButton(props: Props) {
  async function handleClick() {
    try {
      await downloadBookingIcs(props);
      toast.success("Calendar invite downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Could not generate calendar invite");
    }
  }

  return (
    <Button
      onClick={handleClick}
      className="w-full sm:w-auto rounded-full bg-primary text-primary-foreground
                 hover:bg-primary/90 shadow-sm hover:shadow-md
                 transition-all duration-300 hover:scale-[1.02]
                 px-8 py-6"
    >
      <Calendar className="mr-2 h-4 w-4" />
      Add to Calendar
    </Button>
  );
}
