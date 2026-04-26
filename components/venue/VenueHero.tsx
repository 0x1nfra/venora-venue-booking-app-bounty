import { MapPin, Users, Clock } from "lucide-react";
import { formatPrice } from "@/lib/config";

interface VenueHeroProps {
  name: string;
  city: string;
  address: string;
  capacity: number;
  pricePerDay: number;
  bookingMode: "full_day" | "hourly";
}

export function VenueHero({ name, city, address, capacity, pricePerDay, bookingMode }: VenueHeroProps) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">{name}</h1>
      <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
        <span className="flex items-center gap-1.5 text-sm">
          <MapPin className="w-4 h-4 shrink-0" />
          {address}, {city}
        </span>
        <span className="flex items-center gap-1.5 text-sm">
          <Users className="w-4 h-4 shrink-0" />
          Up to {capacity.toLocaleString()} guests
        </span>
        <span className="flex items-center gap-1.5 text-sm">
          <Clock className="w-4 h-4 shrink-0" />
          {bookingMode === "full_day" ? "Full-day booking" : "Hourly booking"}
        </span>
      </div>
      <p className="text-2xl font-semibold text-primary">
        {formatPrice(pricePerDay)}
        <span className="text-base font-normal text-muted-foreground ml-1">/ day</span>
      </p>
    </div>
  );
}
