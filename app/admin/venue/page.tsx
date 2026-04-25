"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

const VENUE_SLUG = "the-grand-hall-kl";

export default function AdminVenuePage() {
  const venue = useQuery(api.venues.getBySlug, { slug: VENUE_SLUG });

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Venue Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            View your venue details.
          </p>
        </div>

        <div className="rounded-lg border bg-muted/30 px-4 py-3 flex items-start gap-2 mb-8 text-sm text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <span>Editing venue details is coming in v2.</span>
        </div>

        {venue === undefined ? (
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : venue === null ? (
          <p className="text-muted-foreground text-sm">Venue not found.</p>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Venue Name</Label>
              <Input id="name" value={venue.name} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={venue.description}
                disabled
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" value={venue.capacity} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Day (MYR)</Label>
                <Input
                  id="price"
                  value={venue.pricePerDay.toLocaleString()}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={venue.address} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={venue.city} disabled />
            </div>

            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="flex flex-wrap gap-2 rounded-md border bg-muted/50 px-3 py-2 min-h-10">
                {venue.amenities.map((a) => (
                  <Badge key={a} variant="secondary">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode">Booking Mode</Label>
              <Input
                id="mode"
                value={venue.bookingMode === "full_day" ? "Full Day" : "Hourly"}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input id="status" value={venue.status} disabled />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
