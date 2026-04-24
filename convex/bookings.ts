import { customAlphabet } from "nanoid";
import { internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  21
);

export const getBookedDates = query({
  args: { venueId: v.id("venues") },
  handler: async (ctx, { venueId }) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_venue_and_status", (q) =>
        q.eq("venueId", venueId).eq("status", "approved")
      )
      .take(500);
    return bookings.map((b) => b.eventDate);
  },
});

export const getByPublicToken = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const booking = await ctx.db
      .query("bookings")
      .withIndex("by_public_token", (q) => q.eq("publicToken", token))
      .unique();
    if (!booking) return null;
    const venue = await ctx.db.get(booking.venueId);
    return { ...booking, venueName: venue?.name ?? "Unknown Venue" };
  },
});

export const create = mutation({
  args: {
    venueId: v.id("venues"),
    guestName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.string(),
    eventDate: v.string(),
    eventType: v.string(),
    guestCount: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const venue = await ctx.db.get(args.venueId);
    if (!venue) throw new Error("Venue not found");

    const publicToken = nanoid();

    const bookingId = await ctx.db.insert("bookings", {
      venueId: args.venueId,
      vendorId: venue.vendorId,
      guestName: args.guestName,
      guestEmail: args.guestEmail,
      guestPhone: args.guestPhone,
      eventDate: args.eventDate,
      eventType: args.eventType,
      guestCount: args.guestCount,
      notes: args.notes,
      status: "pending",
      publicToken,
    });

    await ctx.scheduler.runAfter(0, internal.emails.sendBookingSubmitted, {
      bookingId,
    });

    return { bookingId, publicToken };
  },
});

export const getBookingForEmail = internalQuery({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, { bookingId }) => {
    const booking = await ctx.db.get(bookingId);
    if (!booking) return null;
    const venue = await ctx.db.get(booking.venueId);
    return {
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      eventDate: booking.eventDate,
      eventType: booking.eventType,
      publicToken: booking.publicToken,
      venueName: venue?.name ?? "Unknown Venue",
    };
  },
});
