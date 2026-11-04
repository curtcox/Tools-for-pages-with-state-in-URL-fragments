import { test, expect } from '@playwright/test';
import { adapter, ready } from './adapter.js';
import { computeCID } from '../../src/core/cid.js';

test('explicit source, compressed document and CID links preserve local drafts', async ({ page }) => {
  await ready(page);
  await adapter.edit(page, 'Previous draft');
  const previous = await page.evaluate(key => localStorage.getItem(key), adapter.draftKey);
  expect(previous).toContain('Previous draft');
  const href = await adapter.build(page, { src: 'Linked document ☕' });
  await ready(page, href); await expect(page.locator(adapter.editor)).toHaveValue('Linked document ☕');
  await page.reload(); await page.locator(adapter.ready).waitFor();
  expect(await page.evaluate(key => localStorage.getItem(key), adapter.draftKey)).toBe(previous);
  await page.evaluate(() => { location.hash = encodeURIComponent('Legacy source'); });
  await expect(page.locator(adapter.editor)).toHaveValue('Legacy source');
  const cid = await computeCID('Inline source');
  await ready(page, './?doc=invalid#' + cid); await expect(page.locator(adapter.editor)).toHaveValue('Inline source');
});
test('invalid explicit links report errors without default fallback', async ({ page }) => {
  await ready(page, './#v1.invalid!');
  await expect(page.locator(adapter.status)).toContainText('decompressed');
});
test('history writes use fragments and examples are replaced once', async ({ page }) => {
  await ready(page, './?example=' + encodeURIComponent(adapter.example));
  await expect(page).toHaveURL(/#v1\./); expect(new URL(page.url()).searchParams.has('example')).toBe(false);
  await adapter.edit(page, 'Edited note'); await expect(page).toHaveURL(/#v1\./);
  await page.waitForFunction(() => location.hash.length > 4);
  await page.waitForTimeout(350); const href = page.url();
  await ready(page, href); await expect(page.locator(adapter.editor)).toHaveValue('Edited note');
});
