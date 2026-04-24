export const isSingleVenueMode =
  process.env.NEXT_PUBLIC_SINGLE_VENUE_MODE === "true";

export const singleVenueSlug =
  process.env.NEXT_PUBLIC_SINGLE_VENUE_SLUG ?? "the-grand-hall-kl";

export const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Venora";

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}
