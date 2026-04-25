"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { BookingDetailSheet } from "@/components/admin/BookingDetailSheet";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCards } from "@/components/admin/StatsCards";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { useAdminUIStore } from "@/stores/admin-ui-store";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const selectedBooking = useAdminUIStore((s) => s.selectedBooking);
  const setSelectedBooking = useAdminUIStore((s) => s.setSelectedBooking);

  const vendor = useQuery(api.vendors.getMyVendor);
  const bookings = useQuery(
    api.bookings.listByVendor,
    vendor ? { vendorId: vendor._id } : "skip"
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold tracking-tight">
            The Command Center
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time overview and booking management.
          </p>
        </div>

        {vendor === undefined ? (
          <DashboardSkeleton />
        ) : vendor === null ? (
          <p className="text-muted-foreground text-sm">
            No vendor account linked to this user.
          </p>
        ) : (
          <>
            <div className="mb-8">
              <StatsCards bookings={bookings ?? []} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <ActivityFeed bookings={bookings ?? []} />
              </div>
              <div className="lg:col-span-8">
                <BookingsTable
                  bookings={bookings}
                  onSelectBooking={setSelectedBooking}
                />
              </div>
            </div>
          </>
        )}
      </main>

      <BookingDetailSheet
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
        <div className="lg:col-span-8 space-y-3">
          <Skeleton className="h-10 w-64" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
