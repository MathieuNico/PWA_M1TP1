import { test, expect } from '@playwright/test';

test.describe('Room Management', () => {
    test('should create a new room successfully', async ({ page }) => {
        // Clear state to be sure
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();

        // 1. Go to the application
        // Don't check title as it might be empty during loading/SSR
        await page.waitForLoadState('networkidle');

        // Check if we are on the Home page by looking for the button
        const startButton = page.getByText('Commencer');
        await expect(startButton).toBeVisible({ timeout: 15000 });

        // 2. Click "Commencer" on HomePage
        await startButton.click();

        // 3. Login if necessary
        // Wait for the pseudo input to appear (it should be in ReceptionPage)
        const pseudoInput = page.locator('#pseudo');
        await pseudoInput.waitFor({ state: 'visible', timeout: 10000 });
        await pseudoInput.fill('TesterE2E');
        await page.getByRole('button', { name: 'Se connecter' }).click();

        // 4. Verify we are logged in
        // Use a more specific selector to avoid strict mode violation (multiple h3)
        const welcomeHeading = page.getByRole('heading', { name: /Bienvenue/i });
        await expect(welcomeHeading).toBeVisible({ timeout: 10000 });
        await expect(welcomeHeading).toContainText('TesterE2E');

        // 5. Click on Create Room button
        await page.getByRole('button', { name: /Créer une salle/i }).click();

        // 6. Fill room details
        await page.getByLabel('Nom de la salle').fill('TestE2E');
        await page.getByLabel('Description').fill('Ceci est une salle de test créée par Playwright');

        // 7. Submit creation
        await page.locator('.modal-content').getByRole('button', { name: 'Créer' }).click();

        // 8. Verify the room was created and we are displayed in it
        // Check for the RoomPage header
        const roomHeader = page.locator('.room-header h1');
        await expect(roomHeader).toContainText('TestE2E', { timeout: 15000 });

        // 9. Go back and check if it's in the list
        await page.locator('.back-btn').first().click();

        // Use a more specific locator for the room card
        const roomCard = page.locator('.room-card').filter({ hasText: 'TestE2E' });
        await expect(roomCard).toBeVisible();
    });
});
