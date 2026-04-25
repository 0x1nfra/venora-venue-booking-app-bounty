"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { StatusBadge } from "@/components/booking/StatusBadge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUIStore } from "@/stores/admin-ui-store";
import { CalendarDays, CheckCircle, Inbox, Search, X, XCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import { useDebounce } from "@/lib/use-debounce";
import { toShortId } from "@/lib/ics-generator";

type Booking = Doc<"bookings">;
type FilterTab = "all" | "pending" | "approved" | "rejected";

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: "Wedding",
  conference: "Conference",
  birthday: "Birthday",
  corporate: "Corporate",
  other: "Other",
};

interface BookingsTableProps {
  bookings: Booking[] | undefined;
  onSelectBooking?: (booking: Booking) => void;
}

export function BookingsTable({ bookings, onSelectBooking }: BookingsTableProps) {
  const { filterTab, setFilterTab, searchQuery, setSearchQuery } = useAdminUIStore();
  const [loadingId, setLoadingId] = useState<Id<"bookings"> | null>(null);
  const updateStatus = useMutation(api.bookings.updateStatus);
  const debouncedSearch = useDebounce(searchQuery);

  async function handleInlineAction(
    e: React.MouseEvent,
    bookingId: Id<"bookings">,
    status: "approved" | "rejected",
  ) {
    e.stopPropagation();
    setLoadingId(bookingId);
    try {
      await updateStatus({ bookingId, status });
      toast.success(status === "approved" ? "Booking approved." : "Booking rejected.");
    } catch {
      toast.error("Failed to update status. Try again.");
    } finally {
      setLoadingId(null);
    }
  }

  const filtered = (bookings ?? []).filter((b) => {
    if (filterTab !== "all" && b.status !== filterTab) return false;
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    const shortId = toShortId(b._id).toLowerCase();
    return (
      b.guestName.toLowerCase().includes(q) ||
      b.guestEmail.toLowerCase().includes(q) ||
      shortId.includes(q.replace(/^ven-/i, ""))
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by guest name, email, or booking ID..."
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as FilterTab)}>
        <div className="overflow-x-auto">
        <TabsList>
          {TABS.map((tab) => {
            const count =
              tab.value === "all"
                ? (bookings?.length ?? 0)
                : (bookings?.filter((b) => b.status === tab.value).length ?? 0);
            return (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
                <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium">
                  {count}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        </div>
      </Tabs>

      {bookings === undefined ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={debouncedSearch ? "No bookings match your search" : "No bookings yet"}
          description={
            debouncedSearch
              ? undefined
              : filterTab === "all"
                ? "Bookings will appear here in real-time."
                : `No ${filterTab} bookings.`
          }
        >
          {debouncedSearch && (
            <button
              className="text-sm text-primary underline-offset-2 hover:underline"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </button>
          )}
        </EmptyState>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Event Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking) => (
                <TableRow
                  key={booking._id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onSelectBooking?.(booking)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.guestName}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.guestEmail}
                      </p>
                      <p className="text-xs text-muted-foreground sm:hidden mt-0.5">
                        {booking.eventDate}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-1.5 text-sm">
                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                      {booking.eventDate}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {EVENT_TYPE_LABELS[booking.eventType] ?? booking.eventType}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right text-xs text-muted-foreground font-mono">
                    {format(new Date(booking._creationTime), "dd MMM, HH:mm")}
                  </TableCell>
                  <TableCell className="text-right">
                    {booking.status === "pending" && (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800 cursor-pointer"
                          disabled={loadingId === booking._id}
                          onClick={(e) => handleInlineAction(e, booking._id, "approved")}
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs text-red-700 border-red-200 hover:bg-red-50 hover:text-red-800 cursor-pointer"
                          disabled={loadingId === booking._id}
                          onClick={(e) => handleInlineAction(e, booking._id, "rejected")}
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
