"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { isToday, isSameMonth } from "date-fns";

type Booking = Doc<"bookings">;

const STATUS_DOT: Record<string, string> = {
  pending: "bg-amber-400",
  approved: "bg-emerald-500",
  rejected: "bg-red-400",
  cancelled: "bg-gray-400",
};

interface BookingsCalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  bookings: Booking[];
  onSelect: (booking: Booking) => void;
}

export function BookingsCalendarDay({
  date,
  isCurrentMonth,
  bookings,
  onSelect,
}: BookingsCalendarDayProps) {
  const today = isToday(date);
  const hasBookings = bookings.length > 0;

  return (
    <div
      className={cn(
        "min-h-[80px] p-1.5 border-b border-r border-border/50 flex flex-col",
        !isCurrentMonth && "opacity-40",
      )}
    >
      <span
        className={cn(
          "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 self-end",
          today && "bg-primary text-primary-foreground",
          !today && "text-muted-foreground",
        )}
      >
        {date.getDate()}
      </span>

      {hasBookings && (
        <div className="flex flex-col gap-0.5 overflow-hidden">
          {bookings.slice(0, 3).map((b) => (
            <button
              key={b._id}
              onClick={() => onSelect(b)}
              className={cn(
                "flex items-center gap-1 rounded px-1 py-0.5 text-left hover:bg-muted/60 transition-colors group w-full",
              )}
            >
              <span
                className={cn(
                  "shrink-0 w-1.5 h-1.5 rounded-full",
                  STATUS_DOT[b.status] ?? "bg-gray-400",
                )}
              />
              <span className="text-[10px] text-foreground truncate leading-tight">
                {b.guestName}
              </span>
            </button>
          ))}
          {bookings.length > 3 && (
            <span className="text-[10px] text-muted-foreground px-1">
              +{bookings.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
