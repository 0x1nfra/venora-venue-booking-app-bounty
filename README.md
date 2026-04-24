# Venora — Venue Booking Web App

A responsive venue booking web app where guests browse a venue, pick a date, and submit a booking request — and admins review and approve/reject in real-time.

Built for the **KrackedDevs RM500 Bounty** (due 26 April 2026, 1:00 AM MYT).

---

## Live Demo

> Add your Vercel URL here after deploying.

**Demo credentials:**

| Role  | Email             | Password  |
| ----- | ----------------- | --------- |
| Admin | admin@demo.com    | demo1234  |

**Public venue:** `/venues/the-grand-hall-kl`

---

## Features

- **Venue detail page** — photos, description, amenities, capacity, pricing
- **Booking request form** — RHF + Zod validation, all required fields
- **Live availability calendar** — disabled dates reflect approved bookings in real-time
- **Booking confirmation** — unique public token link for guest status checks
- **Admin dashboard** — real-time bookings table via Convex WebSocket subscriptions
- **Approve / Reject actions** — optimistic UI, status updates propagate to date picker instantly
- **Email notifications** — booking submitted (guest), status change (guest), new booking alert (admin) via Resend
- **Mobile responsive** — tested at 375px (iPhone SE)

---

## Tech Stack

| Layer       | Choice                                  |
| ----------- | --------------------------------------- |
| Framework   | Next.js 16 (App Router)                 |
| Styling     | Tailwind CSS v4                         |
| Components  | shadcn/ui (new-york preset)             |
| Backend/DB  | Convex (queries, mutations, file store) |
| Realtime    | Convex WebSocket subscriptions          |
| Auth        | @convex-dev/auth (password provider)    |
| Client state| Zustand (UI state only)                 |
| Forms       | React Hook Form + Zod                   |
| Email       | Resend + React Email                    |
| Testing     | Vitest (unit) + Playwright (E2E)        |
| Deploy      | Vercel + Convex Cloud                   |

---

## Local Setup

**Prerequisites:** Node 20+, pnpm, a Convex account, a Resend account

### 1. Clone and install

```bash
git clone <repo-url>
cd venora-venue-booking-app-bounty
pnpm install
```

### 2. Start Convex dev server

```bash
pnpm dlx convex dev
```

This creates a `.env.local` with `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_DEPLOYMENT` automatically.

### 3. Add remaining env vars to `.env.local`

```env
NEXT_PUBLIC_APP_NAME=Venora
NEXT_PUBLIC_SINGLE_VENUE_MODE=true
NEXT_PUBLIC_SINGLE_VENUE_SLUG=the-grand-hall-kl
```

### 4. Set Resend keys in Convex environment

Emails are sent from Convex actions (not Next.js), so these go into Convex env — not `.env.local`:

```bash
pnpm dlx convex env set RESEND_API_KEY re_your_key_here
pnpm dlx convex env set RESEND_FROM_EMAIL onboarding@resend.dev
pnpm dlx convex env set ADMIN_NOTIFICATION_EMAIL your@email.com
```

> Note: `onboarding@resend.dev` is Resend's shared sender. No domain verification needed for testing.

### 5. Seed the database

```bash
pnpm dlx convex run seed:default
```

Creates: 1 vendor, 1 venue (The Grand Hall KL), 1 admin user, 3 sample bookings across statuses.

### 6. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Running Tests

```bash
# Unit tests (Vitest)
pnpm test

# E2E tests (Playwright) — requires dev server running
pnpm exec playwright test
```

---

## Architecture Notes

### Single-venue mode

The codebase is architected as a multi-tenant marketplace (`vendors` → `venues` → `bookings`) but ships in single-venue mode for the bounty via an env flag:

```ts
// lib/config.ts
export const isSingleVenueMode = process.env.NEXT_PUBLIC_SINGLE_VENUE_MODE === "true";
```

Zero throwaway code — the same schema serves future multi-vendor expansion.

### Real-time data flow

Convex's `useQuery` hooks maintain WebSocket subscriptions. When an admin approves a booking:
1. `bookings.updateStatus` mutation runs server-side
2. All subscribers (dashboard + date picker) receive the update in <1s
3. The approved date becomes disabled in the public booking form instantly

### Email pattern

Mutations schedule Convex internal actions via `ctx.scheduler.runAfter(0, ...)`. The mutation completes fast; email sends asynchronously. If Resend fails, the booking is unaffected — only the email is lost (logged to Convex).

### Data model highlights

- `publicToken` — 21-char nanoid on every booking; lets guests check status without an account at `/booking/[token]`
- `pricePerDay` stored in MYR cents (avoid float math)
- `by_venue_and_date` index — O(1) availability lookups for the date picker
- `vendorId` denormalized on `bookings` — admin queries stay fast without joins

---

## Project Structure

```
app/
  (public)/         # Guest-facing pages (landing, venue, booking form, status check)
  admin/            # Admin pages (login, dashboard) behind auth guard
convex/             # Backend: schema, queries, mutations, actions, seed
components/
  booking/          # BookingForm, DatePickerWithAvailability, StatusBadge
  venue/            # VenueHero, VenueGallery, AmenitiesList
  admin/            # BookingsTable, BookingDetailSheet, DashboardStats
emails/             # React Email templates (BookingSubmitted, StatusChanged, NewBookingAlert)
lib/                # validators.ts (Zod), utils.ts, config.ts
stores/             # Zustand: admin filter tab + detail panel state
tests/
  unit/             # Vitest: validators, utils
  e2e/              # Playwright: guest booking, admin approval, availability sync
```

---

## Known Limitations

- Email sender uses Resend's shared `onboarding@resend.dev` — may land in spam. Production deployment should use a verified domain.
- Vendor/super-admin UI is deferred (schema exists, no UI).
- Hourly booking mode is schema-ready but not implemented.
- No payment integration in v1.

---

## Submission

Built by **Irfan Murad (1nfra)** for the KrackedDevs RM500 Venue Booking Bounty.
