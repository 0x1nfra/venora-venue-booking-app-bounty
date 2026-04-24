"use client";

import { Doc } from "@/convex/_generated/dataModel";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUIStore } from "@/stores/admin-ui-store";
import { CalendarDays, Inbox } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { format } from "date-fns";

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
  const { filterTab, setFilterTab } = useAdminUIStore();

  const filtered =
    bookings?.filter((b) => filterTab === "all" || b.status === filterTab) ?? [];

  return (
    <div className="space-y-4">
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
          title="No bookings yet"
          description={
            filterTab === "all"
              ? "Bookings will appear here in real-time."
              : `No ${filterTab} bookings.`
          }
        />
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
