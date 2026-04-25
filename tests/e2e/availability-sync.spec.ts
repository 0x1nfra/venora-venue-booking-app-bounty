import { test, expect } from "@playwright/test";
import { addDays } from "date-fns";

const VENUE_SLUG = "the-grand-hall-kl";
const ADMIN_EMAIL = "admin@demo.com";
const ADMIN_PASSWORD = "demo1234";

// Seed creates an approved booking for today+7 — it should be blocked in the calendar
test("date picker disables dates with approved bookings", async ({ page }) => {
  await page.goto(`/book/${VENUE_SLUG}`);
  await expect(page.getByRole("heading", { name: "Request a Booking" })).toBeVisible();

  // Wait for Convex to push booked dates (helper text appears when bookedDates.length > 0)
  await expect(page.getByText("Greyed-out dates are already booked.")).toBeVisible({
    timeout: 10000,
  });

  // Seed runs on Convex (UTC). Compute today+7 in UTC to match.
  const nowUtc = new Date();
  const approvedDate = new Date(Date.UTC(
    nowUtc.getUTCFullYear(),
    nowUtc.getUTCMonth(),
    nowUtc.getUTCDate() + 7,
  ));
  const approvedDay = approvedDate.getUTCDate().toString();
  const localNow = new Date();
  const localMonth = localNow.getMonth();
  const approvedMonth = approvedDate.getUTCMonth();

  // Navigate forward if approved date is in next month
  if (approvedMonth !== localMonth) {
    await page.getByRole("button", { name: /next month/i }).click();
  }

  const disabledCell = page
    .locator('td[data-disabled="true"]')
    .filter({ hasText: new RegExp(`^${approvedDay}$`) })
    .first();

  await expect(disabledCell).toBeVisible();
});

test("approved booking date becomes disabled after admin action", async ({ page, context }) => {
  // Pick a date ~90 days out — well clear of any seed bookings
  const targetDate = addDays(new Date(), 90);
  const targetDay = targetDate.getDate().toString();

  // --- Step 1: Submit a booking for targetDate ---
  await page.goto(`/book/${VENUE_SLUG}`);
  await expect(page.getByRole("heading", { name: "Request a Booking" })).toBeVisible();

  await page.getByLabel("Full Name").fill("Sync Test Guest");
  await page.getByLabel("Email").fill("sync@test.com");
  await page.getByLabel("Phone Number").fill("+60199999999");
  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: "Birthday" }).click();
  await page.getByLabel("Number of Guests").fill("50");

  // Navigate to target month (3 months ahead)
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: /next month/i }).click();
  }

  // Click the day button (must click the <button> inside the gridcell)
  const dayButton = page
    .locator("td:not([data-disabled='true'])")
    .locator("button")
    .filter({ hasText: new RegExp(`^${targetDay}$`) })
    .first();
  await dayButton.click();
  await expect(page.getByText(/Selected:/)).toBeVisible();

  await page.getByRole("button", { name: "Request Booking" }).click();
  await expect(page).toHaveURL(/\/booking\/.+/, { timeout: 15000 });

  // --- Step 2: Admin approves the booking in a new tab ---
  const adminPage = await context.newPage();
  await adminPage.goto("/admin/login");
  await adminPage.getByLabel("Email").fill(ADMIN_EMAIL);
  await adminPage.getByLabel("Password").fill(ADMIN_PASSWORD);
  await adminPage.getByRole("button", { name: "Sign in" }).click();
  await expect(adminPage).toHaveURL(/\/admin\/dashboard/, { timeout: 15000 });

  await adminPage.getByRole("tab", { name: /pending/i }).click();

  const syncRow = adminPage.getByRole("row").filter({ hasText: "Sync Test Guest" });
  await expect(syncRow).toBeVisible({ timeout: 10000 });
  await syncRow.click();

  await expect(adminPage.getByRole("button", { name: /approve/i })).toBeVisible();
  await adminPage.getByRole("button", { name: /approve/i }).click();
  await expect(adminPage.getByText("Booking approved.")).toBeVisible({ timeout: 8000 });
  await adminPage.close();

  // --- Step 3: Verify the date is now disabled in the booking form ---
  await page.goto(`/book/${VENUE_SLUG}`);
  await expect(page.getByRole("heading", { name: "Request a Booking" })).toBeVisible();

  // Wait for Convex to push updated booked dates
  await expect(page.getByText("Greyed-out dates are already booked.")).toBeVisible({
    timeout: 10000,
  });

  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: /next month/i }).click();
  }

  const blockedCell = page
    .locator('td[data-disabled="true"]')
    .filter({ hasText: new RegExp(`^${targetDay}$`) })
    .first();

  await expect(blockedCell).toBeVisible();
});
