import { internalMutation } from "./_generated/server";

export const reset = internalMutation({
  args: {},
  handler: async (ctx) => {
    const tables = ["bookings", "venues", "vendors", "authAccounts", "authSessions", "authVerificationCodes", "authRateLimits", "users"] as const;
    for (const table of tables) {
      const docs = await ctx.db.query(table as any).collect();
      await Promise.all(docs.map((d: any) => ctx.db.delete(d._id)));
      console.log(`Cleared ${docs.length} rows from ${table}`);
    }
  },
});

export default internalMutation({
  args: {},
  handler: async (ctx) => {
    // Idempotency: skip if vendor already exists
    const existing = await ctx.db
      .query("vendors")
      .withIndex("by_slug", (q) => q.eq("slug", "venora"))
      .first();
    if (existing) {
      console.log("Seed already run — skipping");
      return;
    }

    // Create admin user via authTables directly
    const userId = await ctx.db.insert("users", {
      email: "admin@demo.com",
      name: "Venora Admin",
    });

    // Lucia Scrypt hash of "demo1234" — format: {salt_hex}:{hash_hex}
    const passwordHash =
      "871c594fbfb0e5a55842d4ba97275874:d4b4ccd171f2dff54a7ced117343a8b78c9938af263254bb9ca6c41341ae747360a802418086981f6ae668cf456100dad33d0b4a70223963f4ba1a5af96a69e3";
    await ctx.db.insert("authAccounts", {
      userId,
      provider: "password",
      providerAccountId: "admin@demo.com",
      secret: passwordHash,
    });

    // Create vendor
    const vendorId = await ctx.db.insert("vendors", {
      name: "Venora",
      slug: "venora",
      ownerId: userId,
      status: "active",
      contactEmail: "admin@demo.com",
      contactPhone: "+60123456789",
    });

    // Store placeholder imageIds (empty for seed — real uploads need HTTP)
    const venueId = await ctx.db.insert("venues", {
      vendorId,
      name: "The Grand Hall KL",
      slug: "the-grand-hall-kl",
      description:
        "A stunning 5,000 sq ft ballroom in the heart of Kuala Lumpur, perfect for weddings, corporate galas, and milestone celebrations. Features soaring 6-metre ceilings, crystal chandeliers, state-of-the-art AV equipment, and a dedicated bridal suite.",
      capacity: 500,
      pricePerDay: 500000, // RM 5,000 in cents
      address: "123 Jalan Ampang, KLCC",
      city: "Kuala Lumpur",
      amenities: [
        "wifi",
        "parking",
        "aircon",
        "av_equipment",
        "catering_kitchen",
        "bridal_suite",
        "stage",
        "dance_floor",
      ],
      imageIds: [],
      bookingMode: "full_day",
      status: "active",
    });

    // Sample bookings across all statuses
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split("T")[0];
    const addDays = (d: Date, n: number) =>
      new Date(d.getTime() + n * 86400000);

    await ctx.db.insert("bookings", {
      venueId,
      vendorId,
      guestName: "Ahmad Faris",
      guestEmail: "ahmad.faris@example.com",
      guestPhone: "+60111234567",
      eventDate: fmt(addDays(today, 14)),
      eventType: "wedding",
      guestCount: 350,
      notes: "Traditional Malay wedding, need prayer room access.",
      status: "pending",
      publicToken: "tok_pending_demo_001",
    });

    await ctx.db.insert("bookings", {
      venueId,
      vendorId,
      guestName: "Priya Nair",
      guestEmail: "priya.nair@example.com",
      guestPhone: "+60197654321",
      eventDate: fmt(addDays(today, 7)),
      eventType: "conference",
      guestCount: 200,
      notes: "Annual company townhall. Need projector and mic setup.",
      status: "approved",
      statusChangedAt: Date.now() - 3600000,
      statusChangedBy: userId,
      publicToken: "tok_approved_demo_002",
    });

    await ctx.db.insert("bookings", {
      venueId,
      vendorId,
      guestName: "Wei Liang Tan",
      guestEmail: "weiliang@example.com",
      guestPhone: "+60163339999",
      eventDate: fmt(addDays(today, 3)),
      eventType: "birthday",
      guestCount: 80,
      notes: "21st birthday party.",
      status: "rejected",
      adminNotes: "Date unavailable due to private event.",
      statusChangedAt: Date.now() - 7200000,
      statusChangedBy: userId,
      publicToken: "tok_rejected_demo_003",
    });

    console.log("✅ Seed complete");
    console.log(`   Vendor: ${vendorId}`);
    console.log(`   Venue:  ${venueId}`);
    console.log(`   Admin:  ${userId}`);
  },
});
