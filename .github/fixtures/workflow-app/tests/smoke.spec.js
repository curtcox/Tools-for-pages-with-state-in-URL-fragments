import { test, expect } from '@playwright/test';
import { access, writeFile } from 'node:fs/promises';

test('contract runner and server use the nested application', async ({ page }) => {
  await access('pre-test.marker');
  expect(process.env.FRAGMENT_KIT_CONTRACT_CONFIG).toBe('contract.config.mjs');
  await page.goto('/');
  await expect(page.getByRole('heading')).toHaveText('Nested workflow fixture');
  await writeFile('contract.marker', 'ok');
});
