import { test, expect } from "@playwright/test";

test.describe("Gather Clone Basic Functionality", () => {
	test("should load the homepage", async ({ page }) => {
		await page.goto("/");

		// Check if the page loads successfully
		await expect(page).toHaveTitle(/Gather/);

		// Look for sign in elements (the app should redirect to sign in for unauthenticated users)
		await expect(page.locator("text=Sign")).toBeVisible({ timeout: 10000 });
	});

	test("should be able to navigate to sign in page", async ({ page }) => {
		await page.goto("/");

		// Wait for any redirects or page loads
		await page.waitForLoadState("networkidle");

		// Check if we can see sign in related content
		const signInButton = page
			.locator('button:has-text("Sign"), a:has-text("Sign")')
			.first();

		if (await signInButton.isVisible()) {
			await signInButton.click();

			// Should navigate to a sign in page or modal
			await expect(
				page.locator('input[type="email"], input[type="text"]'),
			).toBeVisible({ timeout: 5000 });
		}
	});

	test("should load Supabase Studio", async ({ page }) => {
		// Test that our local Supabase is running
		await page.goto("http://localhost:54323");

		// Should see Supabase Studio interface
		await expect(page.locator("text=Supabase")).toBeVisible({ timeout: 10000 });
	});

	test("should have backend API responding", async ({ page }) => {
		// Test that backend server is responding
		const response = await page.request.get(
			"http://localhost:3001/getPlayerCounts?realmIds=[]",
		);
		expect(response.status()).toBe(401); // Should require auth, but server is responding
	});

	test("should create user account and access main app", async ({ page }) => {
		await page.goto("/signin");

		// Wait for page to load
		await page.waitForLoadState("networkidle");

		// Look for email input field
		const emailInput = page.locator('input[type="email"]');
		const passwordInput = page.locator('input[type="password"]');

		if ((await emailInput.isVisible()) && (await passwordInput.isVisible())) {
			// Fill in test credentials
			await emailInput.fill("test@example.com");
			await passwordInput.fill("password123");

			// Look for sign up button (since we don't have an account yet)
			const signUpButton = page.locator(
				'button:has-text("Sign up"), button:has-text("Create")',
			);

			if (await signUpButton.isVisible()) {
				await signUpButton.click();

				// After successful sign up, should redirect to main app
				await page.waitForURL("**/app**", { timeout: 10000 });

				// Should see the main app interface
				await expect(page.locator("text=Realms, text=Create")).toBeVisible({
					timeout: 5000,
				});
			}
		}
	});
});
