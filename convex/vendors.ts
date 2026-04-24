import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getMyVendor = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject as Id<"users">;
    return ctx.db
      .query("vendors")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();
  },
});
