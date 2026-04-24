"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { useAdminUIStore } from "@/stores/admin-ui-store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Building2 } from "lucide-react";

export default function AdminDashboardPage() {
  const { signOut } = useAuthActions();
  const router = useRouter();
  const filterTab = useAdminUIStore((s) => s.filterTab);

  const vendor = useQuery(api.vendors.getMyVendor);
  const bookings = useQuery(
    api.bookings.listByVendor,
    vendor ? { vendorId: vendor._id } : "skip"
  );

  async function handleSignOut() {
    await signOut();
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">Venora Admin</span>
            {vendor && (
              <span className="hidden sm:inline text-sm text-muted-foreground ml-2">
                — {vendor.name}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </header>

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
          <BookingsTable bookings={bookings} />
        )}
      </main>
    </div>
  );
}
