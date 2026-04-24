import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@demo.com";
const ADMIN_PASSWORD = "demo1234";

test("admin can log in and approve a pending booking", async ({ page }) => {
  // --- Log in ---
  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: "Admin Login" })).toBeVisible();

  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();

  // Should land on dashboard
  await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15000 });
  await expect(page.getByRole("heading", { name: "Bookings" })).toBeVisible();

  // --- Find a pending booking ---
  // Click Pending filter tab
  await page.getByRole("tab", { name: /pending/i }).click();

  // Wait for at least one row (seed provides a pending booking)
  const firstRow = page.getByRole("row").filter({ hasText: /pending/i }).first();
  await expect(firstRow).toBeVisible({ timeout: 10000 });

  // Click the row to open the detail sheet
  await firstRow.click();

  // Sheet opens with Approve/Reject buttons
  await expect(page.getByRole("button", { name: /approve/i })).toBeVisible();

  // Approve
  await page.getByRole("button", { name: /approve/i }).click();

  // Toast confirms success
  await expect(page.getByText("Booking approved.")).toBeVisible({ timeout: 8000 });

  // Sheet closes — no more approve button
  await expect(page.getByRole("button", { name: /approve/i })).not.toBeVisible();
});

test("admin redirects to login when unauthenticated", async ({ page }) => {
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10000 });
});
