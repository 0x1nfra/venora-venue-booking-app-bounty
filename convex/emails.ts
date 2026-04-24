"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Resend } from "resend";
import { BookingSubmittedEmail } from "../emails/BookingSubmitted";
import * as React from "react";

export const sendBookingSubmitted = internalAction({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, { bookingId }) => {
    const booking = await ctx.runQuery(internal.bookings.getBookingForEmail, {
      bookingId,
    });
    if (!booking) {
      console.error("sendBookingSubmitted: booking not found", bookingId);
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const appUrl = process.env.APP_URL ?? "http://localhost:3000";

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
        to: booking.guestEmail,
        subject: `Booking Request Received — ${booking.venueName}`,
        react: React.createElement(BookingSubmittedEmail, {
          guestName: booking.guestName,
          venueName: booking.venueName,
          eventDate: booking.eventDate,
          eventType: booking.eventType,
          publicToken: booking.publicToken,
          appUrl,
        }),
      });
    } catch (err) {
      console.error("Resend sendBookingSubmitted error:", err);
    }
  },
});
