import { query } from "./_generated/server";
import { v } from "convex/values";

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const venue = await ctx.db
      .query("venues")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (!venue) return null;
    const imageUrls = (
      await Promise.all(venue.imageIds.map((id) => ctx.storage.getUrl(id)))
    ).filter((u): u is string => u !== null);
    return { ...venue, imageUrls };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("venues")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});
