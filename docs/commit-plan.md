# Venora — Phase 1 Commit Breakdown

**Philosophy:** Each commit = one focused unit of work = one agent context reset point.
**Commit style:** Conventional Commits (`feat:`, `chore:`, `fix:`, `test:`, `docs:`, `style:`).
**After each commit:** `git push`, clear agent context, paste PRD + "we just completed commit N, now do N+1" for next task.

---

## Thursday Night / Friday Morning — Foundation (6 commits, ~6h)

### Commit 1: `chore: initial project scaffold`

**Scope:** Next.js + Tailwind + shadcn init, gitignore in place, first push
**Why this commit:** Proves the toolchain works before you add anything custom
**Done when:** `pnpm dev` loads a Next.js default page, `.gitignore` is correct, repo is on GitHub
**Files touched:** Entire scaffold, `.gitignore`, `README.md` (just the title for now)
**Agent context needed:** Just the PRD §6 (Architecture) and the gitignore you have
**⚠️ Verify before commit:** `git status` shows no `.env*` files

---

### Commit 2: `chore: install dependencies and configure shadcn`

**Scope:** Install all runtime + dev deps from PRD appendix, add all shadcn components listed
**Done when:** `components/ui/` has all 15 shadcn components, `package.json` has Convex, Zustand, RHF, Zod, Resend, React Email, Vitest, Playwright
**Files touched:** `package.json`, `pnpm-lock.yaml`, `components.json`, `components/ui/*`
**Agent context:** PRD §6 tech stack table + quick-start commands
**💡 Tip:** Commit this separately from scaffold so dependency changes are diffable later

---

### Commit 3: `feat(convex): initialize convex with schema`

**Scope:** `pnpm dlx convex dev` init, define full schema from PRD §5
**Done when:** Convex dev server runs, `convex/schema.ts` has `vendors`, `venues`, `bookings` tables with all indexes, `convex/_generated/` populates
**Files touched:** `convex/schema.ts`, `convex/auth.config.ts`, `convex.json`
**Agent context:** PRD §5 (entire data model section)
**⚠️ Verify:** `convex/_generated/` is gitignored — it should NOT appear in `git status`

---

### Commit 4: `feat(auth): wire up convex auth with password provider`

**Scope:** Install `@convex-dev/auth`, add password provider, create `ConvexAuthProvider` wrapper in app layout
**Done when:** Can call `signIn`/`signOut` from a test component without errors (don't build UI yet)
**Files touched:** `convex/auth.ts`, `convex/http.ts`, `app/layout.tsx`, `app/ConvexClientProvider.tsx`, `middleware.ts`
**Agent context:** PRD §6 auth strategy subsection + Convex Auth docs (agent should fetch these)

---

### Commit 5: `feat(convex): add seed script with demo data`

**Scope:** Seed script creates Venora vendor, Grand Hall KL venue, admin user, 3 sample bookings across statuses, uploads 4 Unsplash images to Convex File Storage
**Done when:** `pnpm dlx convex run seed:default` populates the DB, you can query it and see data in Convex dashboard
**Files touched:** `convex/seed.ts`, possibly a small helper `convex/lib/seedHelpers.ts`
**Agent context:** PRD §5 seed script subsection + §3 single-venue mode notes
**💡 Tip:** This commit is critical — without seed data, every subsequent page looks broken. Do not skip to building UI before this works.

---

### Commit 6: `chore: deploy hello-world to vercel + convex cloud`

**Scope:** Deploy what you have (which is basically nothing yet) to prove the deploy pipeline works
**Done when:** You have a live Vercel URL that loads the default page, Convex prod deployment exists, env vars set in both Vercel and Convex
**Files touched:** Maybe just a `README.md` update with the deploy URL
**Agent context:** You don't really need the agent for this — it's mostly clicking around Vercel dashboard
**⚠️ This is the single most important non-code commit.** If deploy breaks Saturday night, you're dead. Prove it works while you have 36 hours to fix it.

---

## Friday — Public Flow + Emails (6 commits, ~9h)

### Commit 7: `feat(venue): landing page with venora branding`

**Scope:** Landing page, minimal Venora wordmark in header, hero section pointing to the single venue, footer
**Done when:** `/` loads cleanly, CTA links to `/venues/the-grand-hall-kl`, responsive at 375px
**Files touched:** `app/(public)/page.tsx`, `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `public/venora-logo.svg`
**Agent context:** PRD §4 Flow 1 + §7 UI/UX guidelines

---

### Commit 8: `feat(venue): venue detail page with gallery and amenities`

**Scope:** Venue detail page pulling from Convex via `venues.getBySlug`, image gallery, description, amenities list, capacity, price, "Book now" CTA
**Done when:** `/venues/the-grand-hall-kl` loads seeded venue, images render, CTA links to `/book/the-grand-hall-kl`
**Files touched:** `app/(public)/venues/[slug]/page.tsx`, `components/venue/VenueHero.tsx`, `components/venue/VenueGallery.tsx`, `components/venue/AmenitiesList.tsx`, `convex/venues.ts` (getBySlug query)
**Agent context:** PRD §5 venues schema + §4 user flows + §7 components list

---

### Commit 9: `feat(booking): booking form with date picker availability`

**Scope:** Booking form page, RHF + Zod validation, DatePicker that disables booked dates, event type select, all fields from PRD
**Done when:** `/book/the-grand-hall-kl` renders full form, calendar visibly disables dates that have `approved` bookings, client-side validation works
**Files touched:** `app/(public)/book/[venueSlug]/page.tsx`, `components/booking/BookingForm.tsx`, `components/booking/DatePickerWithAvailability.tsx`, `lib/validators.ts`, `convex/bookings.ts` (getBookedDates query)
**Agent context:** PRD §4 Flow 1 acceptance criteria + §5 bookings schema
**💡 Tip:** This is the highest-complexity commit in Phase 1. Budget 2+ hours. Do NOT try to combine with the mutation commit.

---

### Commit 10: `feat(booking): submit mutation and confirmation page`

**Scope:** `bookings.create` Convex mutation, form submit wires to it, redirect to confirmation page showing booking ID + public token link
**Done when:** Form submission creates a booking in Convex with `status: "pending"`, confirmation page renders, public status-check page at `/booking/[token]` works
**Files touched:** `convex/bookings.ts` (create mutation, getByPublicToken query), `app/(public)/book/[venueSlug]/page.tsx` (submit handler), `app/(public)/booking/[token]/page.tsx`, `components/booking/StatusBadge.tsx`
**Agent context:** PRD §4 Flow 1 + §5 publicToken design decision

---

### Commit 11: `feat(email): resend integration with booking submitted template`

**Scope:** Resend setup, `BookingSubmitted` React Email template, Convex internal action that sends it, mutation schedules the action
**Done when:** Submitting a booking triggers an email to the guest's address (test with your own email). Email looks presentable in Gmail.
**Files touched:** `emails/BookingSubmitted.tsx`, `convex/emails.ts` (internal action), `convex/bookings.ts` (scheduler call added to create mutation)
**Agent context:** PRD §6 email notifications subsection
**⚠️ Set env vars:** `pnpm dlx convex env set RESEND_API_KEY ...` BEFORE running this

---

### Commit 12: `feat(email): new booking alert to admin`

**Scope:** `NewBookingAlert` template, mutation also schedules admin alert alongside guest confirmation
**Done when:** Booking submission sends two emails — one to guest, one to `ADMIN_NOTIFICATION_EMAIL`
**Files touched:** `emails/NewBookingAlert.tsx`, `convex/emails.ts` (add sendNewBookingAlert action), `convex/bookings.ts` (add second scheduler call)
**Agent context:** PRD §6 email templates list (template #3)

---

## Saturday Morning — Admin Flow (4 commits, ~7h)

### Commit 13: `feat(admin): login page and auth guard layout`

**Scope:** `/admin/login` with email+password form, `app/admin/layout.tsx` that redirects unauthenticated users, middleware for fast cookie check
**Done when:** Logging in with `admin@demo.com / demo1234` works, redirects to `/admin/dashboard`, unauth'd users hitting `/admin/*` get bounced to login
**Files touched:** `app/admin/login/page.tsx`, `app/admin/layout.tsx`, `middleware.ts` (update)
**Agent context:** PRD §6 auth strategy + §4 Flow 2

---

### Commit 14: `feat(admin): dashboard with realtime bookings table`

**Scope:** Admin dashboard, real-time `useQuery` subscription to bookings, table view with guest name, date, event type, status, timestamp, filter tabs (All/Pending/Approved/Rejected)
**Done when:** Dashboard loads bookings, submitting a new booking from another tab makes it appear in <1s, filters work, Zustand stores current filter tab
**Files touched:** `app/admin/dashboard/page.tsx`, `components/admin/BookingsTable.tsx`, `components/admin/StatusBadge.tsx` (if not reused), `stores/admin-ui-store.ts`, `convex/bookings.ts` (listByVendor query)
**Agent context:** PRD §4 Flow 2 + §5 bookings schema + §6 Zustand usage note

---

### Commit 15: `feat(admin): booking detail sheet with approve/reject actions`

**Scope:** Clicking a booking row opens a Sheet (or Dialog on mobile) with full booking details, Approve/Reject buttons call `bookings.updateStatus` mutation, optimistic UI updates
**Done when:** Admin can approve or reject, status changes immediately in the table, the approved date now shows as disabled in the public date picker (prove the real-time loop works end-to-end)
**Files touched:** `components/admin/BookingDetailSheet.tsx`, `convex/bookings.ts` (updateStatus mutation)
**Agent context:** PRD §4 Flow 2 + §5 status machine
**💡 Tip:** This is the "wow moment" commit. After this ships, test it by opening two browser tabs — public booking form in one, admin dashboard in the other. Watch a booking submit in tab 1 and appear in tab 2. That's your demo video shot.

---

### Commit 16: `feat(email): status change notification to guest`

**Scope:** `BookingStatusChanged` template, `updateStatus` mutation schedules email action
**Done when:** Approving or rejecting sends an email to the guest with the new status
**Files touched:** `emails/BookingStatusChanged.tsx`, `convex/emails.ts` (add sendStatusChanged action), `convex/bookings.ts` (scheduler call in updateStatus)
**Agent context:** PRD §6 email templates list (template #2)

---

## Saturday Afternoon — Testing + Polish + Submission (4 commits, ~3h)

### Commit 17: `test: vitest unit tests for validators and utils`

**Scope:** Vitest config, unit tests for Zod schemas (valid + invalid cases), date helpers, currency formatting
**Done when:** `pnpm test` passes, covers the `lib/validators.ts` and `lib/utils.ts` files meaningfully
**Files touched:** `vitest.config.ts`, `tests/unit/validators.test.ts`, `tests/unit/utils.test.ts`
**Agent context:** PRD §8 testing strategy
**⚠️ Timebox:** 30 min max. Don't write tests for shadcn wrappers or React rendering.

---

### Commit 18: `test: playwright e2e tests for critical paths`

**Scope:** Playwright config, 3 E2E tests — guest books venue, admin approves booking, date picker shows disabled date after approval
**Done when:** `pnpm exec playwright test` passes locally against dev server
**Files touched:** `playwright.config.ts`, `tests/e2e/guest-booking.spec.ts`, `tests/e2e/admin-approval.spec.ts`, `tests/e2e/availability-sync.spec.ts`
**Agent context:** PRD §8 Playwright E2E list + user flows
**⚠️ If these flake after 45 min of debugging, skip this commit.** Ship without E2E tests. Note it in README. Do not let Playwright eat your submission window.

---

### Commit 19: `style: mobile polish and empty states`

**Scope:** Mobile responsive pass at 375px (iPhone SE), Skeleton loaders during Convex query suspense, empty state for dashboard when no bookings, Sonner toasts on all mutations
**Done when:** Site works cleanly on phone-sized viewport, no "flash of empty content", all user actions give feedback
**Files touched:** Various component files, likely `components/ui/empty-state.tsx` new
**Agent context:** PRD §7 UI/UX guidelines + §3 item 15 (minimal branding polish)

---

### Commit 20: `docs: readme with setup, demo credentials, and submission notes`

**Scope:** README with project description, tech stack, local setup steps, demo credentials, live URL, architecture notes, link to Loom demo video
**Done when:** A KrackedDevs judge can clone the repo, follow the README, and run it locally in under 10 minutes. Or watch the demo video and see the full flow.
**Files touched:** `README.md`, possibly `.env.example`
**Agent context:** None — you write this yourself, it's your pitch to the judges

**Tag the submission:**

```bash
git tag -a v1.0-bounty-submission -m "KrackedDevs RM500 Venue Booking bounty submission"
git push --tags
```

---

## Phase 1.1 — "Velvet & Steel" UI Overhaul (7 commits, ~10h)

**Status:** All commits 1-20 are shipped. UI overhaul is being pulled forward into the bounty itself based on the Stitch design mocks ("Velvet & Steel" personality — boutique hospitality precision). Total budget: ~10 hours of focused work, leaving ~3-4 hours for demo video + README + buffer.

**Design system reference:**

- **Background:** `hsl(30 20% 98%)` Soft Bone (light) / `hsl(240 10% 4%)` Deep Obsidian (dark — defer)
- **Primary:** `hsl(24 70% 50%)` Burnt Terracotta (already similar to your warm accent)
- **Heading font:** Noto Serif (italic for the "Venora" wordmark)
- **Body font:** Geist Sans (already installed)
- **Borders:** `0.5px` width, `border-outline-variant` color
- **Radius:** `0.5rem` (lg) for cards, `9999px` (full) for primary CTAs

**Priority order if time-pressed:** 21 > 22 > 23 > 24 > 25 > 26 > 27. Drop from the bottom.

**What to explicitly NOT extract from the Stitch mocks** (these are traps):

- Multi-venue Bento grid on landing page (single-venue mode)
- Check-in/Check-out date range picker pattern (your bookings are full-day, not Airbnb-style)
- Revenue $ stat card (you don't have payments)
- Cleaning fee + Service fee line items (you don't model these)
- Reviews section + 4.95 star rating (deferred feature, not real data)
- Magnetic buttons / availability pulse / receipt-fold animations (Framer Motion rabbit hole)
- Bricolage Grotesque (pick one serif: Noto Serif, that's it)
- Activity Feed payment events (your activity = booking events only)
- "View All" / "Show all 24 amenities" links (imply data you don't have)

---

### Commit 21: `feat(theme): velvet and steel design system foundation`

**Scope:** Update `app/globals.css` with the new color tokens (Soft Bone background, Burnt Terracotta primary, warm surface variants). Install Noto Serif via `next/font/google` alongside existing Geist. Add `font-serif` utility to Tailwind config pointing at Noto Serif. Replace existing accent color values throughout.
**Why this commit:** This is the **single highest-impact change in the overhaul.** Before any layout changes, just swapping the color palette + adding the serif font instantly transforms how every existing page looks. If you only have time for ONE UI commit, this is it.
**Done when:** Running `pnpm dev` shows every page now has the warm bone/terracotta palette. Existing components didn't break — they just look different. No layout changes yet.
**Files touched:** `app/globals.css` (all CSS variables), `app/layout.tsx` (font imports), `tailwind.config.ts` (font family), `components/ui/button.tsx` (verify cursor-pointer present)
**Agent context:** Stitch design system color values + Tailwind theme docs
**💡 Tip:** Use the exact HSL values from the Stitch CSS config. Copy the entire color block. Don't try to "improve" it — the palette is cohesive as-is.
**⚠️ Test before commit:** Walk through every page (landing, venue detail, booking form, admin login, admin dashboard) and verify nothing is unreadable. Low contrast bugs are easy to introduce here.
**⏱️ Budget:** 45-60 min

---

### Commit 22: `feat(layout): glassmorphism nav and italic serif wordmark`

**Scope:** Update top navigation across public + admin layouts: fixed positioning, `backdrop-blur-xl bg-white/70`, `border-b-[0.5px] border-outline-variant`, subtle shadow. Change Venora wordmark to italic Noto Serif. Add nav links (`Venues`, `Concierge`, etc. — point to `#` or actual routes).
**Why this commit:** The nav is on every page. Upgrading it propagates everywhere. Glassmorphism is a 2026 design signal that costs ~5 lines of Tailwind.
**Done when:** Nav is fixed top, semi-transparent with blur, sharp 0.5px bottom border. Venora wordmark is italic serif. Admin pages share the same nav style with the same wordmark (just different right-side actions — Sign Out instead of Sign In).
**Files touched:** `components/layout/Header.tsx`, `app/admin/layout.tsx` (admin header variant)
**Agent context:** Stitch landing page nav HTML structure (lines: `<nav class="fixed top-0..."`)
**💡 Tip:** Add `pt-24` or similar to your `<main>` containers to compensate for the now-fixed nav, otherwise content gets hidden under it.
**⏱️ Budget:** 30-45 min

---

### Commit 23: `feat(landing): immersive hero with serif headline`

**Scope:** Replace landing page hero with Stitch-style immersive layout: full-bleed background image (use one of your seeded venue Unsplash images), gradient overlay fading to background color, large serif headline with italic accent on second line ("Unforgettable Spaces, _Curated with Precision._"), pill-shaped primary CTA. Skip the multi-venue Bento grid below — replace with a single large "Featured Venue" card that links to The Grand Hall KL.
**Why this commit:** Landing is the first impression for judges. Current landing is functional; this makes it look intentional.
**Done when:** Landing has full-bleed hero image, serif headline with italic accent, working CTA to venue detail. Below the hero is ONE featured venue card (not a grid). Footer styled to match.
**Files touched:** `app/(public)/page.tsx`, `components/layout/Footer.tsx`, possibly new `components/landing/HeroSection.tsx` and `components/landing/FeaturedVenueCard.tsx`
**Agent context:** Stitch landing page HTML — extract the hero `<header>` block + footer. **IGNORE the Bento grid section** — single venue mode means one card, not nine.
**💡 Tip:** For the hero image, just reuse one of the venue images already in Convex File Storage. Don't introduce new assets.
**⚠️ Common pitfall:** The Stitch mock uses serif `<h1>` with italic on a `<span>`. Make sure your Tailwind config has `font-serif` pointing at Noto Serif and that you're using `italic` class, not the Italic font weight.
**⏱️ Budget:** 60-90 min

---

### Commit 24: `feat(venue): bento gallery and sticky pricing sidebar`

**Scope:** Restructure venue detail page: (a) Replace gallery grid with the 4-column / 2-row Bento layout from Stitch mock — one large 2x2 image left, four smaller images right, "Show all photos" button on the bottom-right image. (b) Move pricing/booking CTA into a sticky right sidebar that follows scroll on desktop. (c) Restyle "About the space" / "Capacity" / "Amenities" sections with serif h2 headings + 0.5px section dividers.
**Why this commit:** Venue detail is THE money page — it's where judges spend the most time and where the "luxury booking" feel lands or dies.
**Done when:** Gallery is a Bento grid (asymmetric, large hero image left). Pricing sidebar is sticky on desktop, stacks below content on mobile. Section headings are serif. The "Check Availability" CTA in the sidebar links to your existing booking form (do NOT replace the booking form pattern — keep your single-date model, just style the CTA card around it).
**Files touched:** `components/venue/VenueGallery.tsx` (Bento grid), `components/venue/StickyBookingSidebar.tsx` (new), `app/(public)/venues/[slug]/page.tsx` (layout grid 8/4 cols), `components/venue/AmenitiesList.tsx` (icon + label rows)
**Agent context:** Stitch venue detail HTML — extract the `<main>` block. **DO NOT extract the Cleaning fee / Service fee line items in the sidebar** — those don't exist in your data. Show price + total only.
**💡 Tip:** The sticky sidebar is `position: sticky; top: 120px;` on a wrapper div. The `lg:col-span-4` for sidebar + `lg:col-span-8` for content is the easy way.
**⚠️ Mobile critical:** Sticky sidebar disasters on mobile. Use `lg:sticky` so it's only sticky on large screens; on mobile, it stacks below content normally.
**⏱️ Budget:** 90-120 min — **the longest commit in the overhaul.** Budget accordingly.

---

### Commit 25: `feat(booking): concierge request form with pill chips`

**Scope:** Restyle booking form to match Stitch "Concierge Request" mock: rename page H1 to "Concierge Request", add subtitle "Allow us to tailor an extraordinary experience for your upcoming event." Replace event-type Select with **pill-shaped radio chips** (Corporate Retreat / Wedding Reception / Private Dining / Brand Launch / Other). Use underline-only inputs for First Name/Last Name/Email/Phone (border-bottom only, transparent bg). Use bordered inputs for Date / Guest Count / Notes. Pill primary submit button.
**Why this commit:** The form is what judges actually interact with most when testing your demo. Better visual hierarchy + the chip pattern signals thought.
**Done when:** Form looks like the Stitch mock. Pill chips work as a radio group (only one selected at a time). Submit button is pill-shaped, primary color. Form still validates with existing Zod schema.
**Files touched:** `components/booking/BookingForm.tsx`, possibly extend `lib/validators.ts` event types if your enum changed
**Agent context:** Stitch booking form HTML — extract the `<form>` block. The pill chip pattern uses `<input type="radio" class="peer sr-only" /> <div class="...peer-checked:bg-primary-container">`.
**💡 Tip:** Don't change the Zod schema or mutation — only the visual layout. The data shape stays identical.
**⏱️ Budget:** 45-60 min

---

### Commit 26: `feat(admin): command center dashboard with activity feed`

**Scope:** Restyle admin dashboard: page H1 "The Command Center" + subtitle "Real-time overview and booking management." Add 3 stat cards at the top (Total Pending / This Week / Approval Rate — **NOT revenue**). Add Activity Feed sidebar on the left showing recent booking events (new request, approved, rejected) — pulls from existing `bookings.listByVendor`, just sorts by `_creationTime` desc and renders timeline-style. Restyle bookings table with subtle status badge glows (`box-shadow: 0 0 8px var(--status-color)`).
**Why this commit:** The admin dashboard is the second-most-judged page. Activity Feed is the "wow" moment of the redesign — it makes the admin feel like a real product, not a CRUD interface.
**Done when:** Stats cards render with real numbers from Convex queries. Activity Feed shows last 5-10 booking events with relative timestamps ("Just now", "15m ago"). Table has new badge styling. Inline Approve/Reject actions still work (carry forward from original Phase 1.1 plan — DO NOT skip these).
**Files touched:** `app/admin/dashboard/page.tsx`, `components/admin/StatsCards.tsx` (new), `components/admin/ActivityFeed.tsx` (new), `components/admin/BookingsTable.tsx` (badge restyle + inline actions), `convex/bookings.ts` (add a small `getRecentActivity` query if needed, or reuse `listByVendor` and sort client-side)
**Agent context:** Stitch admin dashboard HTML — extract the `<main>` block. **DO NOT extract the "Payment Received" or "Revenue (MTD)" elements** — those are payment features you don't have. Substitute "Approval Rate" for the third stat card.
**💡 Tip:** Activity Feed is just `bookings.listByVendor()` results sorted by `statusChangedAt ?? _creationTime` desc, mapped to timeline items. The icon depends on the latest status change. Use `date-fns/formatDistanceToNow` for relative timestamps.
**⚠️ Carry over from original Phase 1.1:** Inline Actions column (Approve/Reject buttons in each row) MUST be in this commit. They were the highest-ROI item from the original polish pass.
**⏱️ Budget:** 90-120 min

---

### Commit 27: `feat(venue): image preview dialog and final polish`

**Scope:** Add click-to-enlarge Dialog on venue gallery images (carry-over from original Commit 24). `cursor-pointer` audit across all interactive elements. Add Venora wordmark + tagline to admin login page. Verify mobile responsiveness at 375px on all redesigned pages — landing, venue detail (Bento collapses to single column on mobile), booking form, admin dashboard. Fix any visual regressions found during walkthrough.
**Why this commit:** This is the cleanup commit. After 5 hours of new component work, things will be slightly broken. This commit is where you walk through the entire app one more time and fix what's wrong.
**Done when:** You can click any venue image to see it enlarged. Every clickable element has a pointer cursor. All redesigned pages work at 375px viewport. Admin login no longer feels like a different app.
**Files touched:** `components/venue/VenueGallery.tsx` (Dialog wrapper), `components/venue/ImagePreviewDialog.tsx` (new), `app/admin/login/page.tsx` (branding), various components for mobile fixes
**Agent context:** Original Phase 1.1 Commit 24 spec + walkthrough notes
**⚠️ If running tight on time:** Skip the image preview Dialog (static gallery is acceptable). Mobile responsiveness is NOT skippable — the bounty explicitly requires responsive design.
**⏱️ Budget:** 60-90 min

---

### Re-tag after the overhaul

```bash
git tag -a v1.1-bounty-submission -m "KrackedDevs RM500 submission with Velvet & Steel UI overhaul"
git push --tags
```

The `v1.0` tag stays as a marker of the functional MVP. `v1.1` is what you submit — same features, dramatically better presentation.

---

## What to do if you fall behind in Phase 1.1

**Total budget: ~10 hours.** With ~25 hours to deadline minus sleep + demo video + README + buffer, you have realistic working time of ~12-14 hours.

If you start falling behind, drop in this order:

- **Skip Commit 27** (final polish) — image Dialog is nice but optional. Mobile responsiveness can be quickly checked during demo video shoot.
- **Skip Commit 26 partially** — keep the new dashboard heading + inline actions, drop the Activity Feed. Still ships visibly upgraded.
- **Skip Commit 25** — the booking form works fine as-is. Concierge styling is a nice-to-have.
- **Never skip Commits 21-24** — these are the visible foundation. Without them you've shipped nothing visually.

**Hard stop rule:** If by Saturday 6pm KL time you haven't finished Commit 24 (the venue detail Bento + sticky sidebar), **stop the overhaul and ship v1.0 as-is.** Half-finished UI looks worse than functional plain UI. The bounty rewards "complete" over "ambitious-but-broken."

**Deploy continuously.** After each commit lands, push to Vercel. If Vercel breaks on commit 25, you can roll back to 24 and still have a polished submission.

---

## Context reset pattern (use this between commits)

When you clear the agent's context, open the new session with this:

```
I'm building Venora, a venue booking web app for the KrackedDevs RM500 bounty due Sunday 26 Apr 2026 1am MYT.

Full PRD: @docs/prd.md

Current state:
- Completed commits 1 through [N]
- [One sentence on any deviations from the PRD, e.g. "skipped Resend domain verification, using onboarding@resend.dev"]
- [Any known issues, e.g. "date picker has a known timezone bug on Safari, will fix in commit N"]

Next task: Commit [N+1] — [title]
[Paste the commit's Scope + Done when + Files touched from the breakdown]

Go.
```

---

## What to do if you fall behind (Phase 1 reference)

The commits are ordered by priority. **You've already completed commits 1-20**, so this is reference material for understanding the original priority hierarchy:

- **Commits 1-10:** Non-negotiable. The app doesn't work without these.
- **Commits 11-12:** Email is a differentiator but not a deal-breaker. Skip if necessary, note in README.
- **Commits 13-16:** Admin flow is required by the bounty. Non-negotiable.
- **Commits 17-18:** Tests are nice but judges don't run them. Skip if necessary.
- **Commits 19-20:** Polish and README are critical for judge perception. Do NOT skip.

**Minimum viable submission** = commits 1, 2, 3, 5, 6, 7, 8, 9, 10, 13, 14, 15, 19, 20 (14 commits). Everything else is leverage.

**Current focus:** Phase 1.1 Velvet & Steel UI overhaul (commits 21-27) → demo video → README polish → submit.
