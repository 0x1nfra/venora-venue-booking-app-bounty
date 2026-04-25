import { createEvent } from "ics";

interface BookingIcsData {
  bookingId: string;
  venueName: string;
  venueAddress: string;
  eventDate: string; // "YYYY-MM-DD"
  eventType: string;
  guestCount: number;
  statusUrl: string;
}

export function generateBookingIcs(data: BookingIcsData): Promise<Blob> {
  const [year, month, day] = data.eventDate.split("-").map(Number);
  const shortId = toShortId(data.bookingId);

  return new Promise((resolve, reject) => {
    createEvent(
      {
        title: `${data.venueName} — ${data.eventType}`,
        start: [year, month, day],
        end: [year, month, day],
        duration: { days: 1 },
        description: [
          `Booking ID: #VEN-${shortId}`,
          `Venue: ${data.venueName}`,
          `Guests: ${data.guestCount}`,
          `Status: Pending`,
          `Check status: ${data.statusUrl}`,
        ].join("\n"),
        location: data.venueAddress,
        organizer: { name: "Venora", email: "bookings@venora.app" },
        url: data.statusUrl,
      },
      (error, value) => {
        if (error || !value) return reject(error ?? new Error("ICS generation failed"));
        resolve(new Blob([value], { type: "text/calendar" }));
      }
    );
  });
}

export function toShortId(convexId: string): string {
  return convexId.slice(-8).toUpperCase();
}
