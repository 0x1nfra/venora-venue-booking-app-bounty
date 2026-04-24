import { test, expect } from "@playwright/test";

const VENUE_SLUG = "the-grand-hall-kl";

test("guest books a venue end-to-end", async ({ page }) => {
  await page.goto(`/book/${VENUE_SLUG}`);

  // Wait for form to load (Convex hydrates)
  await expect(page.getByRole("heading", { name: "Request a Booking" })).toBeVisible();

  // Fill guest info
  await page.getByLabel("Full Name").fill("E2E Test Guest");
  await page.getByLabel("Email").fill("e2e@test.com");
  await page.getByLabel("Phone Number").fill("+60123456789");

  // Event type
  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: "Conference" }).click();

  // Guest count
  await page.getByLabel("Number of Guests").fill("100");

  // Pick the first available (non-disabled) day in the calendar
  // Disabled days: past + approved bookings. Navigate forward 2 months to avoid seed conflicts.
  await page.getByRole("button", { name: /next month/i }).click();
  await page.getByRole("button", { name: /next month/i }).click();

  const availableDay = page
    .locator('[role="gridcell"]:not([aria-disabled="true"])')
    .locator("button:not([disabled])")
    .first();
  await availableDay.click();

  // Confirm date was selected
  await expect(page.getByText(/Selected:/)).toBeVisible();

  // Optional notes
  await page.getByLabel(/Additional Notes/i).fill("E2E test booking — please ignore.");

  // Submit
  await page.getByRole("button", { name: "Request Booking" }).click();

  // Should redirect to confirmation page
  await expect(page).toHaveURL(/\/booking\/.+/, { timeout: 15000 });
  await expect(page.getByRole("heading", { name: "Booking Request Received" })).toBeVisible();
  await expect(page.getByText("pending")).toBeVisible();
  await expect(page.getByText("e2e@test.com")).toBeVisible();
});
