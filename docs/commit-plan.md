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

## Context reset pattern (use this between commits)

When you clear the agent's context, open the new session with this:

```
I'm building Venora, a venue booking web app for the KrackedDevs RM500 bounty due Sunday 26 Apr 2026 1am MYT.

Full PRD: [paste PRD contents]

Current state:
- Completed commits 1 through [N]
- [One sentence on any deviations from the PRD, e.g. "skipped Resend domain verification, using onboarding@resend.dev"]
- [Any known issues, e.g. "date picker has a known timezone bug on Safari, will fix in commit N"]

Next task: Commit [N+1] — [title]
[Paste the commit's Scope + Done when + Files touched from the breakdown]

Go.
```

---

## What to do if you fall behind

The commits are ordered by priority. If Saturday night hits and you're behind schedule:

- **Commits 1-10:** Non-negotiable. The app doesn't work without these.
- **Commits 11-12:** Email is a differentiator but not a deal-breaker. Skip if necessary, note in README.
- **Commits 13-16:** Admin flow is required by the bounty. Non-negotiable.
- **Commits 17-18:** Tests are nice but judges don't run them. Skip if necessary.
- **Commits 19-20:** Polish and README are critical for judge perception. Do NOT skip.

**Minimum viable submission** = commits 1, 2, 3, 5, 6, 7, 8, 9, 10, 13, 14, 15, 19, 20 (14 commits). Everything else is leverage.
