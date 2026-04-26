import Link from "next/link";
import { CalendarDays, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/config";

interface StickyBookingSidebarProps {
  venueSlug: string;
  pricePerDay: number;
  capacity: number;
  city: string;
}

export function StickyBookingSidebar({
  venueSlug,
  pricePerDay,
  capacity,
  city,
}: StickyBookingSidebarProps) {
  return (
    <div className="lg:sticky lg:top-28 rounded-xl border border-hairline border-border bg-card p-6 shadow-[0_4px_24px_rgba(154,65,0,0.08)] flex flex-col gap-5">
      <div className="border-b border-hairline border-border pb-4">
        <p className="text-3xl font-bold tracking-tight">{formatPrice(pricePerDay)}</p>
        <p className="text-sm text-muted-foreground mt-0.5">per day · full-day booking</p>
      </div>

      <ul className="flex flex-col gap-3 text-sm">
        <li className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-4 h-4" />
            Capacity
          </span>
          <span className="font-medium">Up to {capacity.toLocaleString()} guests</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            Booking type
          </span>
          <span className="font-medium">Full-day</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            Location
          </span>
          <span className="font-medium">{city}</span>
        </li>
      </ul>

      <Button asChild size="lg" className="w-full rounded-full">
        <Link href={`/book/${venueSlug}`}>Check Availability</Link>
      </Button>

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        No payment needed — submit a request and we&apos;ll confirm within 24 hours.
      </p>
    </div>
  );
}
