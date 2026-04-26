import { createEvent, EventAttributes } from "ics";

interface BookingIcsInput {
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

export async function downloadBookingIcs(booking: BookingIcsInput): Promise<void> {
  const [year, month, day] = booking.eventDate.split("-").map(Number);

  const event: EventAttributes = {
    title: `${booking.venueName} — ${formatEventType(booking.eventType)}`,
    start: [year, month, day],
    end: [year, month, day + 1],
    description: [
      `Booking ID: ${booking.shortId}`,
      `Guest: ${booking.guestName}`,
      `Event Type: ${formatEventType(booking.eventType)}`,
      `Estimated Guests: ${booking.guestCount}`,
      `Status: ${booking.status.toUpperCase()}`,
      ``,
      `Check status: ${booking.publicStatusUrl}`,
    ].join("\n"),
    location: booking.venueAddress,
    status: "TENTATIVE",
    busyStatus: "TENTATIVE",
    organizer: { name: "Venora", email: "bookings@venora.app" },
    productId: "venora/ics",
  };

  const blob = await createIcsBlob(event);
  triggerDownload(blob, `venora-booking-${booking.shortId.toLowerCase()}.ics`);
}

function createIcsBlob(event: EventAttributes): Promise<Blob> {
  return new Promise((resolve, reject) => {
    createEvent(event, (error, value) => {
      if (error) return reject(error);
      resolve(new Blob([value], { type: "text/calendar;charset=utf-8" }));
    });
  });
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

function formatEventType(raw: string): string {
  const map: Record<string, string> = {
    wedding: "Wedding Reception",
    corporate: "Corporate Retreat",
    private_dining: "Private Dining",
    brand_launch: "Brand Launch",
    other: "Private Event",
  };
  return map[raw] ?? "Private Event";
}
