# PRD: Venora — Hall/Venue Booking Web App

**Project name:** Venora
**Bounty:** KrackedDevs RM500 — Due Sunday 26 April 2026, 1:00 AM MYT
**Owner:** Irfan Murad (1nfra)
**Status:** Ready to build
**Target:** MVP live on Vercel + Convex Cloud by Saturday night

---

## 1. Overview

A responsive venue booking web app where guests browse a venue, pick a date, and submit a booking request — and where admins review and approve/reject those requests in real-time. The codebase is architected as a **multi-tenant marketplace from day one** but ships in **single-venue mode** for the bounty via an environment flag. This means one codebase serves both the bounty submission and future paid client work (single-venue SaaS, multi-vendor marketplace like Venuescape/Peerspace-lite).

**Business value:** Ship a bounty submission in 48 hours that doubles as a productized starting point for Vessl Tech client work. Zero throwaway code.

---

## 2. User Roles & Personas

| Role                             | Access                                         | v1 Scope                    |
| -------------------------------- | ---------------------------------------------- | --------------------------- |
| **Guest** (unauthenticated)      | Browse venue, submit booking request           | ✅ Full                     |
| **Admin** (single-venue owner)   | Review/approve/reject bookings, view dashboard | ✅ Full                     |
| **Vendor** (multi-venue mode)    | Manage own venues, bookings                    | ⚠️ Schema only, UI deferred |
| **Super-admin** (platform owner) | Approve vendors, moderate listings             | ⚠️ Schema only, UI deferred |

---

## 3. Core Features

### Must-Have (Bounty-blocking)

1. **Landing page** — venue hero, highlights, CTA to view details
2. **Venue detail page** — photos, description, capacity, amenities, pricing, location, availability calendar
3. **Booking request form** — name, email, phone, date, event type, guest count, notes
4. **Date picker with availability** — disabled dates show existing approved bookings
5. **Booking confirmation page** — shows booking ID, status (pending), what happens next
6. **Admin login page** — seeded password auth
7. **Admin dashboard** — real-time list of bookings, filter by status, approve/reject actions
8. **Booking statuses** — `pending` → `approved` | `rejected` (+ `cancelled` by guest, future)
9. **Form validation** — Zod schemas, inline errors
10. **Responsive design** — mobile-first, works on 375px+
11. **Email notifications via Resend** — confirmation on booking submission + status change to guest, new booking alert to admin

### Should-Have (ship if time permits)

12. Admin can add internal notes to a booking
13. Guest can check booking status via a unique link (no login) — `/booking/[token]`
14. Admin dashboard stats (total pending, this week, approval rate)
15. Minimal Venora branding (logo wordmark in header, favicon)
16. **Velvet & Steel UI overhaul (v1.1)** — full design system rollout based on Stitch mocks: warm bone/terracotta palette, Noto Serif headings, glassmorphic nav, 0.5px borders, pill chips, status badge glows
17. **Bento gallery on venue detail (v1.1)** — asymmetric 4-col grid replacing simple gallery
18. **Sticky pricing sidebar on venue detail (v1.1)** — floating card with price + Check Availability CTA on desktop
19. **Concierge Request booking form (v1.1)** — underline inputs + pill-chip event type selector
20. **Command Center admin dashboard (v1.1)** — stats cards + Activity Feed sidebar + redesigned bookings table with inline Approve/Reject actions
21. **Image preview dialog (v1.1)** — clicking venue images opens enlarged view in a shadcn Dialog. Lightweight, no carousel, no extra deps. Full lightbox carousel deferred to true Phase 2.

### Nice-to-Have (post-bounty)

22. Google OAuth for admin
23. Multi-venue mode UI (vendor signup, venue CRUD, super-admin approval queue)
24. **Full venue editing** (replace the read-only stub with real CRUD + image upload)
25. **Calendar view of bookings** (admin sees bookings on a month/week grid — strong client-work selling point for Phase 2)
26. **Reviews & ratings** on venue detail pages
27. **Revenue dashboard** (meaningful only after payment integration lands)
28. Hourly time slots (schema already supports)
29. Payment integration (Stripe/Billplz)
30. iCal export
31. SMS notifications
32. **Full lightbox carousel** (replaces the simple Dialog stub from item 21, lands during UI overhaul)

---

## 4. User Flows & Stories

### Flow 1: Guest books a venue

```
Landing → Venue detail → Click "Book now" → Fill form → Submit → Confirmation page
```

**Story:** As a guest, I want to submit a booking request for a specific date so the venue owner can respond.

**Acceptance criteria:**

- Date picker disables dates that already have `approved` bookings
- Date picker disables past dates
- Form validates all required fields before submit (Zod)
- On submit, booking is created with `status: "pending"`
- Confirmation page shows booking ID and a shareable status-check URL
- Confirmation persists on refresh (booking ID in URL)

### Flow 2: Admin reviews bookings

```
/admin/login → Enter credentials → /admin/dashboard → See real-time booking list → Click booking → Approve/Reject
```

**Story:** As an admin, I want to see new booking requests appear instantly without refreshing, so I can respond fast.

**Acceptance criteria:**

- Login uses Convex Auth password provider
- Dashboard uses Convex's `useQuery` — new bookings appear in <1s via WebSocket subscription
- Filter tabs: All | Pending | Approved | Rejected
- Each booking row shows: guest name, date, event type, status badge, submitted timestamp
- Clicking a row opens a detail panel/modal with full info and Approve/Reject buttons
- Action buttons show loading state during mutation
- Status change is optimistic in the UI

### Flow 3: Admin logs out

Standard sign-out, redirect to landing.

---

## 5. Data Model & Convex Schema

File: `convex/schema.ts`

```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables, // users, authAccounts, authSessions, etc.

  // --- Multi-tenant foundation (stubbed for v1) ---
  vendors: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerId: v.id("users"),
    status: v.union(
      v.literal("draft"),
      v.literal("pending_review"),
      v.literal("active"),
      v.literal("suspended"),
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
    pricePerDay: v.number(), // in MYR cents (50000 = RM500)
    address: v.string(),
    city: v.string(),
    amenities: v.array(v.string()), // ["wifi", "parking", "aircon"]
    imageIds: v.array(v.id("_storage")), // Convex File Storage
    bookingMode: v.union(v.literal("full_day"), v.literal("hourly")), // hourly = future
    status: v.union(
      v.literal("draft"),
      v.literal("pending_review"),
      v.literal("active"),
      v.literal("archived"),
    ),
  })
    .index("by_slug", ["slug"])
    .index("by_vendor", ["vendorId"])
    .index("by_status", ["status"]),

  bookings: defineTable({
    venueId: v.id("venues"),
    vendorId: v.id("vendors"), // denormalized for admin queries
    // Guest info (no account required)
    guestName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.string(),
    // Booking details
    eventDate: v.string(), // ISO date "2026-05-15"
    eventType: v.string(), // "wedding", "conference", "birthday", "other"
    guestCount: v.number(),
    notes: v.optional(v.string()),
    // Status machine
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("cancelled"),
    ),
    adminNotes: v.optional(v.string()),
    statusChangedAt: v.optional(v.number()),
    statusChangedBy: v.optional(v.id("users")),
    // Public access token (for guest status-check link)
    publicToken: v.string(),
  })
    .index("by_venue_and_date", ["venueId", "eventDate"])
    .index("by_status", ["status"])
    .index("by_vendor_and_status", ["vendorId", "status"])
    .index("by_public_token", ["publicToken"]),
});
```

### Key design decisions

- **`vendors` and `venues.vendorId` exist in v1** even though single-venue mode only uses one of each. This is the whole point of the "no throwaway code" architecture.
- **`publicToken`** is a random string (nanoid) — lets guests check their booking status without an account.
- **`pricePerDay` in cents** — avoid float math, future-proof for payments.
- **`statusChangedBy`** — audit trail for who approved/rejected.
- **`by_venue_and_date` index** — fast availability lookups for the date picker.
- **Denormalized `vendorId` on `bookings`** — admin dashboard queries stay O(1) per vendor without joins.

### Real-time subscriptions

- `bookings.listByVendor({ vendorId, status? })` → Admin dashboard (auto-subscribes)
- `bookings.getByPublicToken({ token })` → Guest status-check page
- `venues.getBySlug({ slug })` → Venue detail page
- `bookings.getBookedDates({ venueId })` → Date picker availability (returns array of approved ISO dates)

### Seed script (`convex/seed.ts`)

- 1 vendor: "Venora" (auto-approved, status: `active`)
- 1 venue: "The Grand Hall KL" with 4 seeded Unsplash images
- 1 admin user: `admin@demo.com` / `demo1234`
- 3 sample bookings across statuses (1 pending, 1 approved, 1 rejected) so the dashboard doesn't look empty and the date picker demonstrably shows a disabled date

---

## 6. Architecture & Tech Decisions

### Stack

| Layer               | Choice                                               | Why                                     |
| ------------------- | ---------------------------------------------------- | --------------------------------------- |
| Framework           | Next.js 15 (App Router)                              | Required                                |
| Styling             | Tailwind CSS v4                                      | Required                                |
| Components          | shadcn/ui                                            | Required                                |
| Backend/DB/Realtime | Convex                                               | Required                                |
| Auth                | `@convex-dev/auth` (password provider)               | Ships in 15 min, OAuth later            |
| Client state        | Zustand (only for UI state — modal open, filter tab) | Server state is Convex                  |
| Server state        | Convex `useQuery` / `useMutation`                    | Native real-time, no TanStack needed    |
| Forms               | React Hook Form + Zod                                | shadcn-native                           |
| File uploads        | Convex File Storage                                  | Built-in, no S3                         |
| Email               | Resend + React Email                                 | 3000/mo free, Convex action integration |
| Testing             | Vitest (unit) + Playwright (E2E)                     | See §8                                  |
| Deploy              | Vercel (Next) + Convex Cloud                         | Both free tier, 5-min setup             |

### Email notifications (Resend)

**Pattern:** Emails are sent from **Convex actions** (not mutations) because Resend requires external HTTP calls. Mutations trigger a scheduled action via `ctx.scheduler.runAfter(0, ...)` so the mutation stays fast and the email is fire-and-forget.

```ts
// convex/bookings.ts — mutation schedules the email
await ctx.scheduler.runAfter(0, internal.emails.sendBookingSubmitted, {
  bookingId: newBookingId,
});
```

**Three email templates (React Email components in `emails/`):**

1. **`BookingSubmitted.tsx`** → to guest, "We received your request" + status-check link
2. **`BookingStatusChanged.tsx`** → to guest, "Your booking was approved/rejected" + next steps
3. **`NewBookingAlert.tsx`** → to admin, "New booking request from {guestName}" + dashboard link

**Config:**

- Sender: `bookings@venora.app` (or `onboarding@resend.dev` if domain verification is skipped for the bounty — Resend allows this for testing)
- Admin email: hardcoded in env (`ADMIN_NOTIFICATION_EMAIL`) for v1 → moves to `vendors.contactEmail` in multi-vendor mode
- Graceful failure: if Resend call fails, log to Convex but **do not fail the mutation** — the booking is more important than the email

**Time budget: 90 minutes total** (30 min Resend setup + 60 min three templates). Sits in Friday's public flow block — send `BookingSubmitted` and `NewBookingAlert` Friday, `BookingStatusChanged` Saturday morning during admin flow.

### TanStack Query note

**Not using it for v1.** Convex's `useQuery` already handles caching, subscriptions, and optimistic updates. Adding TanStack Query is a layer that provides nothing here. Resend calls go through Convex actions (server-side), not the client — so no need for it there either. I'll add it only if/when we integrate a non-Convex API that the client calls directly (e.g., Google Maps geocoding).

### Folder structure

```
/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                      # Landing
│   │   ├── venues/[slug]/page.tsx        # Venue detail
│   │   ├── book/[venueSlug]/page.tsx     # Booking form
│   │   └── booking/[token]/page.tsx      # Public status check
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── layout.tsx                    # Auth guard
│   │   └── dashboard/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                               # shadcn components
│   ├── booking/
│   │   ├── BookingForm.tsx
│   │   ├── DatePickerWithAvailability.tsx
│   │   └── StatusBadge.tsx
│   ├── venue/
│   │   ├── VenueHero.tsx
│   │   ├── VenueGallery.tsx
│   │   └── AmenitiesList.tsx
│   └── admin/
│       ├── BookingsTable.tsx
│       ├── BookingDetailPanel.tsx
│       └── DashboardStats.tsx
├── convex/
│   ├── schema.ts
│   ├── auth.ts
│   ├── bookings.ts                       # queries + mutations
│   ├── venues.ts
│   ├── vendors.ts
│   ├── seed.ts
│   └── _generated/
├── lib/
│   ├── utils.ts
│   ├── validators.ts                     # Zod schemas (shared client/server)
│   └── config.ts                         # singleVenueMode flag, env helpers
├── stores/
│   └── admin-ui-store.ts                 # Zustand: filter tab, detail panel open
├── tests/
│   ├── unit/
│   └── e2e/
├── emails/                               # React Email templates
│   ├── BookingSubmitted.tsx
│   ├── BookingStatusChanged.tsx
│   └── NewBookingAlert.tsx
├── public/
│   ├── venora-logo.svg                   # Minimal wordmark
│   └── favicon.ico
└── middleware.ts                         # Admin route protection
```

### Environment variables

```env
# .env.local
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
CONVEX_DEPLOYMENT=dev:xxx

# Venora config
NEXT_PUBLIC_APP_NAME=Venora
NEXT_PUBLIC_SINGLE_VENUE_MODE=true
NEXT_PUBLIC_SINGLE_VENUE_SLUG=the-grand-hall-kl

# Email (Resend)
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=onboarding@resend.dev  # or bookings@venora.app if domain verified
ADMIN_NOTIFICATION_EMAIL=admin@demo.com
```

**Note:** `RESEND_API_KEY` goes into Convex's environment (via `npx convex env set`), not Vercel, since emails are sent from Convex actions.

### Auth strategy

- **v1:** Convex Auth password provider. Seeded admin: `admin@demo.com` / `demo1234`.
- **Guard:** `app/admin/layout.tsx` checks `useCurrentUser()` — redirects to `/admin/login` if null.
- **Middleware:** Next.js middleware on `/admin/*` routes does a cookie-presence check for fast redirect (Convex session cookie). Full verification happens in the layout.
- **Post-bounty:** Add Google OAuth (literally 10 lines with `@convex-dev/auth` — you were right, it's not hard).

### Single-venue vs multi-venue mode

```ts
// lib/config.ts
export const isSingleVenueMode =
  process.env.NEXT_PUBLIC_SINGLE_VENUE_MODE === "true";
export const singleVenueSlug = process.env.NEXT_PUBLIC_SINGLE_VENUE_SLUG!;
```

- In single-venue mode, `/` redirects to the single venue's landing, there's no venue index page, and admin dashboard skips vendor-switching UI.
- In multi-venue mode, `/` shows a venue marketplace grid, and admin dashboard scopes to the logged-in user's `vendorId`.
- **For the bounty, `NEXT_PUBLIC_SINGLE_VENUE_MODE=true`.**

---

## 7. UI/UX Guidelines — "Velvet & Steel" Design System

**Personality:** The precision and reliability of a high-end fintech tool (the steel) merged with the warmth, tactility, and luxury of a boutique concierge service (the velvet). Inspired by Linear's refined borders, Aman/Edition Hotels' breathable serif typography and warm palette, and Arc/Framer's tactile micro-interactions.

### Design tokens

**Color palette:**

- Background (light): `hsl(30 20% 98%)` — Soft Bone
- Background surfaces: `hsl(30 15% 96%)` to `hsl(30 10% 92%)` warm grays
- Primary (accent): `#9a4100` (Burnt Terracotta) — sophisticated, warm, high-contrast
- Primary container: `#bd5611` for hover states
- Outline variant: `#ddc1b3` for 0.5px borders
- Status colors: pending = secondary container (amber-warm), approved = tertiary container (deep teal), rejected = error container (warm red), cancelled = surface variant (gray)

**Typography:**

- **Display + Headings (h1, h2):** Noto Serif (italic for accent words like the "Venora" wordmark). Tracking-tight. Used for venue names, page titles, hero copy.
- **Body + UI:** Geist Sans. Used for paragraphs, buttons, form fields, navigation.
- **Metadata:** Geist Mono. Used for booking IDs (`#8845`), timestamps, dates in tables.

**Shape & texture:**

- **Border radius:** `0.5rem` (lg) for cards, inputs, tables. `9999px` (full) for primary CTAs and pill chips.
- **Borders:** `0.5px` width with `border-outline-variant` color — the "Retina-sharp" feel.
- **Shadows:** Multi-layered ambient (`0 2px 10px rgba(0,0,0,0.02)` for resting cards, `0 8px 30px rgba(154,65,0,0.2)` for primary CTAs). Not muddy, not heavy.
- **Glassmorphism:** Reserved for fixed nav (`backdrop-blur-xl bg-white/70`) — frosted crystal, not cheap plastic.

### Page-level patterns

- **Top nav:** Fixed, glassmorphic, italic serif Venora wordmark, link list (Venues / Concierge / etc.), Sign In CTA. Same component shared across public + admin (admin variant just swaps right-side actions).
- **Landing hero:** Full-bleed venue image background with gradient fade to bg color. Serif headline with italic accent on second line. Pill-shaped primary CTA with shimmer effect on hover.
- **Venue detail:** Bento gallery (4-col asymmetric grid, 1 large + 4 small), serif venue name + location/rating row, Capacity + Amenities sections separated by 0.5px dividers, sticky pricing sidebar on desktop.
- **Booking form ("Concierge Request"):** Underline-only inputs for personal info (name, email), bordered inputs for structured fields (date, guest count). Pill-shaped radio chips for event nature. Pill-shaped submit CTA.
- **Admin dashboard ("The Command Center"):** Page header with title + subtitle + Export/New Booking actions. 3-stat-card row (Total Pending / This Week / Approval Rate). Two-column body: Activity Feed sidebar (left) + Recent Bookings table (right). Status badges have subtle glow shadows.

### Components used

`Button`, `Card`, `Input`, `Textarea`, `Select`, `Calendar`, `Dialog`, `Sheet`, `Badge`, `Table`, `Tabs`, `Form`, `Toast` (Sonner), `Skeleton`, `ToggleGroup` (for pill chips).

### Mobile

- Test at 375px (iPhone SE).
- Bento gallery collapses to a single-column stack.
- Sticky booking sidebar uses `lg:sticky` only — stacks below content on mobile.
- Booking form is single-column at all breakpoints.
- Admin dashboard: Activity Feed and table stack vertically, table becomes horizontally scrollable.

### Accessibility

- shadcn handles keyboard nav, focus rings, ARIA — trust the primitives.
- Verify: color contrast on the warm palette (especially terracotta on bone background — should be 4.5:1+), keyboard nav on Bento gallery (each image needs to be focusable for the Dialog trigger), proper `<label>` associations remain after underline-input restyle.
- Italic serif at small sizes is hard to read — only use italic for display sizes (h1, accent words), never for body or UI labels.

### Loading & empty states

- Skeleton for initial loads (especially Bento gallery and booking table).
- Sonner toasts for mutation feedback (booking submitted, status changed).
- Empty Activity Feed: "No recent activity" with a small lucide-react icon.
- Empty Bookings table (filtered to a status with zero results): "No {status} bookings."

### Status badge colors (with glow)

- `pending` → secondary container (warm amber), `box-shadow: 0 0 8px rgba(228,225,231,0.5)`
- `approved` → tertiary container (deep teal), `box-shadow: 0 0 8px rgba(0,125,170,0.2)`
- `rejected` → error container (warm red), `box-shadow: 0 0 8px rgba(255,218,214,0.4)`
- `cancelled` → surface variant (neutral gray), no glow

### Explicitly NOT building (Stitch mock contains these — skip)

- Multi-venue Bento grid on landing (single-venue mode only)
- Check-in/Check-out date range pickers (your model is single-day)
- Revenue dollar stat card (no payments)
- Cleaning fee + Service fee line items (not modeled)
- Reviews section + star ratings (deferred feature)
- Magnetic buttons / availability pulse / receipt-fold animations (Framer Motion rabbit hole — `hover:scale-[1.02]` covers 90% of perceived polish)
- Bricolage Grotesque or any third font (Noto Serif + Geist Sans + Geist Mono is sufficient)
- "Show all 24 amenities" / "View All" / "Show all photos" buttons (imply data you don't have — hardcode or remove)

---

## 8. Non-Functional Requirements

### Performance

- Convex queries are indexed — no full-table scans.
- Images served via Convex File Storage with Next `<Image>` component.
- Lighthouse target: 90+ performance on venue detail page.

### Security

- All mutations validate input server-side with Convex's `v.*` validators + Zod where extra rules needed.
- Admin mutations check `ctx.auth.getUserIdentity()` and verify `vendorId` ownership.
- Rate limiting on booking creation: max 5/hour per IP (use Convex's built-in rate limiter helper).
- `publicToken` is a 21-char nanoid — unguessable.
- No PII in URLs except the public token (which is non-enumerable).

### Testing strategy

**Pragmatic coverage — not 100%. Test what breaks in production.**

**Vitest (unit):**

- `lib/validators.ts` — all Zod schemas (valid + invalid cases)
- `lib/utils.ts` — date helpers, currency formatting
- Convex functions where logic is non-trivial (status transitions, availability check)

**Playwright (E2E) — 3 critical paths:**

1. Guest books a venue end-to-end (landing → detail → form → confirmation)
2. Admin logs in and approves a booking (login → dashboard → approve → status updates)
3. Date picker correctly disables booked dates after admin approves

Skip: component snapshot tests, unit tests for shadcn wrappers, anything that tests "React renders."

**Run in CI:** GitHub Actions on push to `main`. Vercel preview deploys run Playwright against the preview URL.

### Scalability

- Convex free tier: 1M function calls/mo, 1GB storage, 1GB bandwidth. More than enough for bounty + early clients.
- Indexes designed so adding venues/vendors doesn't degrade query perf.

### SEO (landing + venue detail only)

- Next.js metadata API with OG tags on venue detail page.
- `generateStaticParams` on venue detail — ISR with 60s revalidate.
- `robots.txt` + `sitemap.xml` via Next's built-in support.
- Skip schema.org markup for v1 (nice-to-have post-bounty).

---

## 9. Implementation Roadmap

### Phase 1: Bounty MVP (Today → Saturday night, ~36 hours)

**Thursday night / Friday morning (6h) — Foundation**

- [ ] `npx create-next-app@latest` + Tailwind + shadcn init
- [ ] `npx convex dev` — init Convex project
- [ ] Install `@convex-dev/auth`, wire up password provider
- [ ] Define `convex/schema.ts` with all tables from §5
- [ ] Write seed script, run it
- [ ] Deploy to Vercel + Convex Cloud (do this EARLY — smoke test deployment before building)

**Friday (9h) — Public flow + emails**

- [ ] Landing page (hero, CTA, minimal Venora wordmark in header)
- [ ] Venue detail page (gallery, description, amenities, CTA)
- [ ] Booking form page (RHF + Zod + DatePicker with availability)
- [ ] Booking confirmation page
- [ ] Public status-check page (`/booking/[token]`)
- [ ] Convex queries: `venues.getBySlug`, `bookings.getBookedDates`, `bookings.getByPublicToken`
- [ ] Convex mutation: `bookings.create` (schedules email action)
- [ ] Resend setup + `BookingSubmitted` email template
- [ ] `NewBookingAlert` email template + admin notification wire-up

**Saturday morning (7h) — Admin flow**

- [ ] `/admin/login` with Convex Auth password sign-in
- [ ] Admin layout with auth guard
- [ ] Admin dashboard with real-time bookings table
- [ ] Booking detail sheet with Approve/Reject actions
- [ ] Filter tabs (All/Pending/Approved/Rejected)
- [ ] Convex queries: `bookings.listByVendor`
- [ ] Convex mutations: `bookings.updateStatus` (schedules email action)
- [ ] `BookingStatusChanged` email template + wire-up

**Saturday afternoon (3h) — Testing + polish**

- [ ] Write 3 Playwright E2E tests
- [ ] Write Vitest unit tests for validators
- [ ] Mobile responsive pass (375px)
- [ ] Empty states + loading skeletons
- [ ] Toast notifications on mutations
- [ ] Minimal Venora branding: wordmark SVG in header, favicon, footer "Powered by Venora"
- [ ] README with setup instructions + demo credentials + email test note

**Saturday evening (2h) — Submission prep**

- [ ] Record a 2-min demo video (Loom) showing full flow
- [ ] Polish README with screenshots
- [ ] Submit to KrackedDevs by midnight Saturday (buffer before Sun 1am deadline)

### Phase 1.1: Velvet & Steel UI overhaul (Saturday, ~10h)

Pulled forward from the original "post-bounty UI overhaul" slot based on Stitch design mocks. Slot this in **after Commit 20 lands** and **before the demo video shoot**. Total budget: ~10 hours of focused work.

**Commits 21-27 in the commit plan, in order:**

- [ ] **21:** Design system foundation (color palette, fonts, 0.5px borders) — instant visual transformation
- [ ] **22:** Glassmorphic nav + italic serif Venora wordmark across public + admin
- [ ] **23:** Landing page hero with full-bleed image + serif headline
- [ ] **24:** Venue detail Bento gallery + sticky pricing sidebar (longest commit, 90-120 min)
- [ ] **25:** Concierge Request booking form with pill chips
- [ ] **26:** Command Center admin dashboard with Activity Feed + inline actions
- [ ] **27:** Image preview Dialog + cursor-pointer audit + mobile responsiveness pass

**Drop order if behind:** 27 → 26 (partial) → 25. **Never drop 21-24** — they are the visible foundation. **Hard stop:** if Commit 24 isn't done by Saturday 6pm KL, ship v1.0 as-is.

### Phase 2: Multi-vendor mode (Post-bounty, ~1 week)

- Vendor signup flow + vendor dashboard
- Super-admin approval queue
- Venue CRUD for vendors
- Public venue marketplace grid at `/`
- Google OAuth

### Phase 3: Monetization (if pursuing as a product)

- Stripe/Billplz payment integration
- Commission/subscription model
- Hourly booking mode
- Email notifications (Resend)
- iCal export

---

## 10. Open Questions / Risks

### Open questions

All prior open questions resolved. One new consideration:

1. **Resend domain verification** — for the bounty, using `onboarding@resend.dev` as sender is fine (no DNS setup). Post-bounty, verify `venora.app` domain (requires buying domain + adding TXT/MX records, ~15 min once the domain is registered). **Decision for v1: use Resend's shared sender to avoid domain purchase on bounty timeline.**

### Risks & mitigations

| Risk                                                        | Likelihood | Mitigation                                                                                                      |
| ----------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| Convex Auth password provider changes/breaks during setup   | Low        | Fallback: Clerk (also free tier, 10-min swap)                                                                   |
| Deploy config bites on Sat night                            | Medium     | **Deploy a hello-world version on Day 1** before building features                                              |
| Date picker availability logic has off-by-one timezone bugs | Medium     | Store all dates as ISO date strings (no times), test with KL timezone explicitly                                |
| Running out of time on Saturday                             | Medium     | Must-Have list is ranked — ship items 1-11, skip Should-Haves if needed                                         |
| Playwright flakiness eats Saturday                          | Medium     | Write E2E tests LAST. If they flake, ship without and add post-submission                                       |
| Resend emails land in spam during judge review              | Medium     | Use Resend's shared sender (pre-warmed), add plain-text version, test to gmail/outlook/proton before submission |
| Convex free tier limits during demo traffic                 | Very Low   | 1M calls/mo — judges won't hit it                                                                               |

### Things I'm explicitly NOT building for v1

- Vendor signup UI (schema only)
- Super-admin approval queue UI (schema only)
- Payments
- Hourly time slots
- Email notifications (unless trivially cheap)
- Multi-language support
- Dark mode (shadcn gives it free, but not testing)
- Analytics

---

## Appendix: Quick-start commands

```bash
# Setup
pnpm create next-app@latest venora --typescript --tailwind --app
cd venora
pnpm dlx shadcn@latest init  # choose: new-york preset, neutral base color
pnpm dlx shadcn@latest add button card input textarea select calendar dialog sheet badge table tabs form sonner skeleton
pnpm add convex @convex-dev/auth zustand react-hook-form @hookform/resolvers zod date-fns nanoid geist
pnpm add resend react-email @react-email/components
pnpm add -D vitest @vitest/ui @playwright/test

# Convex
pnpm dlx convex dev

# Set Resend key in Convex env (not Vercel — emails send from Convex actions)
pnpm dlx convex env set RESEND_API_KEY re_xxx
pnpm dlx convex env set RESEND_FROM_EMAIL onboarding@resend.dev
pnpm dlx convex env set ADMIN_NOTIFICATION_EMAIL admin@demo.com

# Seed
pnpm dlx convex run seed:default

# Dev
pnpm dev
```

**Demo credentials (for bounty judges):**

- Admin: `admin@demo.com` / `demo1234`
- Public venue URL: `/venues/the-grand-hall-kl`
