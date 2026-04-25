import { z } from "zod";

export const EVENT_TYPES = [
  "wedding",
  "conference",
  "birthday",
  "corporate",
  "other",
] as const;

export const EVENT_TYPE_LABELS: Record<(typeof EVENT_TYPES)[number], string> = {
  wedding: "Wedding Reception",
  conference: "Conference",
  birthday: "Birthday Celebration",
  corporate: "Corporate Retreat",
  other: "Other",
};

export const bookingFormSchema = z.object({
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestEmail: z.string().email("Invalid email address"),
  guestPhone: z.string().min(8, "Phone number is too short"),
  eventDate: z.string().min(1, "Please select a date"),
  eventType: z.enum(EVENT_TYPES, { error: "Please select an event type" }),
  guestCount: z
    .number({ error: "Enter a valid number" })
    .int()
    .min(1, "At least 1 guest required")
    .max(10000, "Maximum 10,000 guests"),
  notes: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
