import { query } from "./_generated/server";
import { v } from "convex/values";

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db
      .query("venues")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
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
