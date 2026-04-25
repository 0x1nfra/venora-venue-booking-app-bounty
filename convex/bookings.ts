import { customAlphabet } from "nanoid";
import { internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const listByVendor = query({
  args: {
    vendorId: v.id("vendors"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, { vendorId, status }) => {
    if (status) {
      return ctx.db
        .query("bookings")
        .withIndex("by_vendor_and_status", (q) =>
          q.eq("vendorId", vendorId).eq("status", status)
        )
        .order("desc")
        .collect();
    }
    return ctx.db
      .query("bookings")
      .withIndex("by_vendor_and_status", (q) => q.eq("vendorId", vendorId))
      .order("desc")
      .collect();
  },
});

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
    await ctx.scheduler.runAfter(0, internal.emails.sendNewBookingAlert, {
      bookingId,
    });

    return { bookingId, publicToken };
  },
});

export const updateStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("Booking not found");

    await ctx.db.patch(args.bookingId, {
      status: args.status,
      adminNotes: args.adminNotes,
      statusChangedAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.emails.sendStatusChanged, {
      bookingId: args.bookingId,
      status: args.status,
    });
  },
});

export const updateNotes = mutation({
  args: {
    bookingId: v.id("bookings"),
    notes: v.string(),
  },
  handler: async (ctx, { bookingId, notes }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    await ctx.db.patch(bookingId, { adminNotes: notes });
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
      guestPhone: booking.guestPhone,
      eventDate: booking.eventDate,
      eventType: booking.eventType,
      guestCount: booking.guestCount,
      notes: booking.notes,
      publicToken: booking.publicToken,
      venueName: venue?.name ?? "Unknown Venue",
    };
  },
});
