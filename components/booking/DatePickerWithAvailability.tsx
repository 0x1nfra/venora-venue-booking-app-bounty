"use client";

import * as React from "react";
import { format, parseISO, startOfDay, isBefore } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerWithAvailabilityProps {
  value?: string;
  onChange: (date: string) => void;
  bookedDates: string[];
  disabled?: boolean;
}

export function DatePickerWithAvailability({
  value,
  onChange,
  bookedDates,
  disabled,
}: DatePickerWithAvailabilityProps) {
  const selectedDate = value ? parseISO(value) : undefined;
  const today = startOfDay(new Date());

  const bookedDateSet = React.useMemo(
    () => new Set(bookedDates),
    [bookedDates]
  );

  const isDateDisabled = React.useCallback(
    (date: Date) => {
      if (disabled) return true;
      if (isBefore(date, today)) return true;
      return bookedDateSet.has(format(date, "yyyy-MM-dd"));
    },
    [disabled, today, bookedDateSet]
  );

  const handleSelect = (date: Date | undefined) => {
    if (date) onChange(format(date, "yyyy-MM-dd"));
  };

  return (
    <div className="flex flex-col gap-2">
      {value && (
        <p className="text-sm text-muted-foreground">
          Selected:{" "}
          <span className="font-medium text-foreground">
            {format(parseISO(value), "PPP")}
          </span>
        </p>
      )}
      <div className="rounded-lg border border-border w-fit">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={isDateDisabled}
        />
      </div>
      {bookedDates.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Greyed-out dates are already booked.
        </p>
      )}
    </div>
  );
}
