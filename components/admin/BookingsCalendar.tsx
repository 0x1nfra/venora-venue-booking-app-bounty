"use client";

import { useState, useMemo } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { getMonthGrid } from "@/lib/calendar-utils";
import { BookingsCalendarDay } from "./BookingsCalendarDay";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, isSameDay, parseISO } from "date-fns";

type Booking = Doc<"bookings">;

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface BookingsCalendarProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
}

export function BookingsCalendar({ bookings, onSelectBooking }: BookingsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const grid = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) {
      if (!b.eventDate) continue;
      const key = b.eventDate;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    }
    return map;
  }, [bookings]);

  function getBookingsForDate(date: Date): Booking[] {
    const key = format(date, "yyyy-MM-dd");
    return bookingsByDate.get(key) ?? [];
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-serif text-base font-semibold tracking-tight">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAY_LABELS.map((day) => (
          <div
            key={day}
            className="text-center text-[11px] font-medium text-muted-foreground py-2 border-r border-border/50 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid — desktop */}
      <div className="hidden sm:block">
        {grid.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map(({ date, isCurrentMonth }, di) => (
              <BookingsCalendarDay
                key={di}
                date={date}
                isCurrentMonth={isCurrentMonth}
                bookings={getBookingsForDate(date)}
                onSelect={onSelectBooking}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Mobile: list of bookings this month grouped by date */}
      <div className="sm:hidden divide-y divide-border">
        {bookings.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No bookings this month.
          </p>
        ) : (
          Array.from(bookingsByDate.entries())
            .filter(([key]) => {
              const d = parseISO(key);
              return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
            })
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([dateKey, dayBookings]) => (
              <div key={dateKey} className="px-4 py-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {format(parseISO(dateKey), "EEEE, d MMM")}
                </p>
                <div className="space-y-1.5">
                  {dayBookings.map((b) => (
                    <button
                      key={b._id}
                      onClick={() => onSelectBooking(b)}
                      className="w-full flex items-center gap-3 rounded-md bg-muted/40 px-3 py-2 text-left hover:bg-muted/60 transition-colors"
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          b.status === "approved"
                            ? "bg-emerald-500"
                            : b.status === "rejected"
                            ? "bg-red-400"
                            : "bg-amber-400"
                        }`}
                      />
                      <span className="text-sm font-medium">{b.guestName}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{b.eventType}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
