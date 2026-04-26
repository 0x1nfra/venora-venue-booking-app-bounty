export function toShortBookingId(convexId: string): string {
  const cleaned = convexId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return `VEN-${cleaned.slice(0, 8)}`;
}
