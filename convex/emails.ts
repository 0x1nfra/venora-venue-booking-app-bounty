"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Resend } from "resend";
import { BookingSubmittedEmail } from "../emails/BookingSubmitted";
import { NewBookingAlertEmail } from "../emails/NewBookingAlert";
import { BookingStatusChangedEmail } from "../emails/BookingStatusChanged";
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

export const sendNewBookingAlert = internalAction({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, { bookingId }) => {
    const booking = await ctx.runQuery(internal.bookings.getBookingForEmail, {
      bookingId,
    });
    if (!booking) {
      console.error("sendNewBookingAlert: booking not found", bookingId);
      return;
    }

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (!adminEmail) {
      console.error("sendNewBookingAlert: ADMIN_NOTIFICATION_EMAIL not set");
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const appUrl = process.env.APP_URL ?? "http://localhost:3000";

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
        to: adminEmail,
        subject: `New Booking Request from ${booking.guestName} — ${booking.venueName}`,
        react: React.createElement(NewBookingAlertEmail, {
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
          guestPhone: booking.guestPhone,
          venueName: booking.venueName,
          eventDate: booking.eventDate,
          eventType: booking.eventType,
          guestCount: booking.guestCount,
          notes: booking.notes,
          dashboardUrl: `${appUrl}/admin/dashboard`,
        }),
      });
    } catch (err) {
      console.error("Resend sendNewBookingAlert error:", err);
    }
  },
});

export const sendStatusChanged = internalAction({
  args: {
    bookingId: v.id("bookings"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
  },
  handler: async (ctx, { bookingId, status }) => {
    const booking = await ctx.runQuery(internal.bookings.getBookingForEmail, {
      bookingId,
    });
    if (!booking) {
      console.error("sendStatusChanged: booking not found", bookingId);
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const appUrl = process.env.APP_URL ?? "http://localhost:3000";

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
        to: booking.guestEmail,
        subject: `Booking ${status === "approved" ? "Approved" : "Rejected"} — ${booking.venueName}`,
        react: React.createElement(BookingStatusChangedEmail, {
          guestName: booking.guestName,
          venueName: booking.venueName,
          eventDate: booking.eventDate,
          eventType: booking.eventType,
          status,
          publicToken: booking.publicToken,
          appUrl,
        }),
      });
    } catch (err) {
      console.error("Resend sendStatusChanged error:", err);
    }
  },
});
