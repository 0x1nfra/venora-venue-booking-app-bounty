import { query } from "./_generated/server";
import { v } from "convex/values";

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
