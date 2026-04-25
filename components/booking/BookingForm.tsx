"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  bookingFormSchema,
  EVENT_TYPES,
  EVENT_TYPE_LABELS,
  type BookingFormValues,
} from "@/lib/validators";
import { toast } from "sonner";
import { DatePickerWithAvailability } from "./DatePickerWithAvailability";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const underlineInputClass =
  "border-0 border-b border-border rounded-none bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-colors placeholder:text-muted-foreground/50";

interface BookingFormProps {
  venueId: Id<"venues">;
  onSuccess: (bookingId: string, publicToken: string) => void;
}

export function BookingForm({ venueId, onSuccess }: BookingFormProps) {
  const bookedDates = useQuery(api.bookings.getBookedDates, { venueId });
  const createBooking = useMutation(api.bookings.create);

  const form = useForm<BookingFormValues>({
    resolver: standardSchemaResolver(bookingFormSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      eventDate: "",
      notes: "",
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    try {
      const result = await createBooking({
        venueId,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        eventDate: data.eventDate,
        eventType: data.eventType,
        guestCount: data.guestCount,
        notes: data.notes,
      });
      onSuccess(result.bookingId, result.publicToken);
    } catch {
      toast.error("Failed to submit booking. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal info — underline inputs */}
        <FormField
          control={form.control}
          name="guestName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                Full Name
              </FormLabel>
              <FormControl>
                <Input
                  className={underlineInputClass}
                  placeholder="Ahmad bin Ibrahim"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="guestEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className={underlineInputClass}
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guestPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    className={underlineInputClass}
                    placeholder="+60 12 345 6789"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Event type — pill chips */}
        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                Nature of Event
              </FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2 pt-1">
                  {EVENT_TYPES.map((type) => (
                    <label key={type} className="cursor-pointer">
                      <input
                        type="radio"
                        className="peer sr-only"
                        name="eventType"
                        value={type}
                        checked={field.value === type}
                        onChange={() => field.onChange(type)}
                      />
                      <span className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-sm transition-colors peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary hover:bg-accent">
                        {EVENT_TYPE_LABELS[type]}
                      </span>
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Structured fields — bordered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Date</FormLabel>
                <FormControl>
                  <DatePickerWithAvailability
                    value={field.value || undefined}
                    onChange={field.onChange}
                    bookedDates={bookedDates ?? []}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guestCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Guests</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={10000}
                    placeholder="250"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const n = e.target.valueAsNumber;
                      field.onChange(isNaN(n) ? undefined : n);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Special Requests{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Setup preferences, dietary requirements, or any special arrangements for your event..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Submitting Request..."
            : "Submit Concierge Request"}
        </Button>
      </form>
    </Form>
  );
}
