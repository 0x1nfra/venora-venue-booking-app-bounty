import { describe, it, expect } from "vitest";
import { bookingFormSchema, EVENT_TYPES } from "@/lib/validators";

const validBooking = {
  guestName: "Ali Hassan",
  guestEmail: "ali@example.com",
  guestPhone: "60123456789",
  eventDate: "2026-05-15",
  eventType: "wedding" as const,
  guestCount: 100,
  notes: "Please arrange parking",
};

describe("bookingFormSchema", () => {
  it("accepts valid booking", () => {
    expect(bookingFormSchema.safeParse(validBooking).success).toBe(true);
  });

  it("accepts booking without notes", () => {
    const { notes: _, ...withoutNotes } = validBooking;
    expect(bookingFormSchema.safeParse(withoutNotes).success).toBe(true);
  });

  describe("guestName", () => {
    it("rejects name shorter than 2 chars", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, guestName: "A" });
      expect(result.success).toBe(false);
    });

    it("accepts name with exactly 2 chars", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, guestName: "Al" });
      expect(result.success).toBe(true);
    });
  });

  describe("guestEmail", () => {
    it("rejects invalid email", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, guestEmail: "notanemail" });
      expect(result.success).toBe(false);
    });

    it("rejects email missing domain", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, guestEmail: "user@" });
      expect(result.success).toBe(false);
    });

    it("accepts valid email formats", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, guestEmail: "user+tag@sub.domain.com" });
      expect(result.success).toBe(true);
    });
  });

  describe("guestPhone", () => {
    it("rejects phone shorter than 8 chars", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, guestPhone: "1234567" });
      expect(result.success).toBe(false);
    });

    it("accepts phone with exactly 8 chars", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, guestPhone: "12345678" });
      expect(result.success).toBe(true);
    });
  });

  describe("eventDate", () => {
    it("rejects empty date", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, eventDate: "" });
      expect(result.success).toBe(false);
    });

    it("accepts ISO date string", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, eventDate: "2026-12-31" });
      expect(result.success).toBe(true);
    });
  });

  describe("eventType", () => {
    it("rejects unknown event type", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, eventType: "party" });
      expect(result.success).toBe(false);
    });

    it("accepts all valid event types", () => {
      for (const type of EVENT_TYPES) {
        const result = bookingFormSchema.safeParse({ ...validBooking, eventType: type });
        expect(result.success).toBe(true);
      }
    });
  });

  describe("guestCount", () => {
    it("rejects 0 guests", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, guestCount: 0 });
      expect(result.success).toBe(false);
    });

    it("rejects negative guest count", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, guestCount: -1 });
      expect(result.success).toBe(false);
    });

    it("rejects count above 10000", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, guestCount: 10001 });
      expect(result.success).toBe(false);
    });

    it("accepts exactly 1 guest", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, guestCount: 1 });
      expect(result.success).toBe(true);
    });

    it("accepts exactly 10000 guests", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, guestCount: 10000 });
      expect(result.success).toBe(true);
    });

    it("rejects decimal guest count", () => {
      const result = bookingFormSchema.safeParse({ ...validBooking, guestCount: 10.5 });
      expect(result.success).toBe(false);
    });
  });
});
