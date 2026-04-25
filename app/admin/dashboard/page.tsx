"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { BookingDetailSheet } from "@/components/admin/BookingDetailSheet";
import { AdminHeader } from "@/components/admin/AdminHeader";
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

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            New requests appear in real-time.
          </p>
        </div>

        {vendor === undefined ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : vendor === null ? (
          <p className="text-muted-foreground text-sm">
            No vendor account linked to this user.
          </p>
        ) : (
          <BookingsTable
            bookings={bookings}
            onSelectBooking={setSelectedBooking}
          />
        )}
      </main>

      <BookingDetailSheet
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}
