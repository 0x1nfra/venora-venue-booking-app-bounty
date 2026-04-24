import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  vendors: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerId: v.id("users"),
    status: v.union(
      v.literal("draft"),
      v.literal("pending_review"),
      v.literal("active"),
      v.literal("suspended")
    ),
    contactEmail: v.string(),
    contactPhone: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_owner", ["ownerId"])
    .index("by_status", ["status"]),

  venues: defineTable({
    vendorId: v.id("vendors"),
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    capacity: v.number(),
    pricePerDay: v.number(),
    address: v.string(),
    city: v.string(),
    amenities: v.array(v.string()),
    imageIds: v.array(v.id("_storage")),
    bookingMode: v.union(v.literal("full_day"), v.literal("hourly")),
    status: v.union(
      v.literal("draft"),
      v.literal("pending_review"),
      v.literal("active"),
      v.literal("archived")
    ),
  })
    .index("by_slug", ["slug"])
    .index("by_vendor", ["vendorId"])
    .index("by_status", ["status"]),

  bookings: defineTable({
    venueId: v.id("venues"),
    vendorId: v.id("vendors"),
    guestName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.string(),
    eventDate: v.string(),
    eventType: v.string(),
    guestCount: v.number(),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("cancelled")
    ),
    adminNotes: v.optional(v.string()),
    statusChangedAt: v.optional(v.number()),
    statusChangedBy: v.optional(v.id("users")),
    publicToken: v.string(),
  })
    .index("by_venue_and_date", ["venueId", "eventDate"])
    .index("by_venue_and_status", ["venueId", "status"])
    .index("by_status", ["status"])
    .index("by_vendor_and_status", ["vendorId", "status"])
    .index("by_public_token", ["publicToken"]),
});
