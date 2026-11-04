import { examples } from './examples.js';
export default {
  catalog: examples,
  baseURL: process.env.GALLERY_BASE_URL ?? 'http://127.0.0.1:8000/demo/',
  output: 'covers',
  dependencies: ['app.js', 'style.css', 'config.js', 'examples.js'],
  async renderCover(page, example) {
    await page.goto(new URL('?example=' + example.id, this.baseURL).href);
    await page.waitForSelector('body[data-ready="true"]');
    await page.waitForFunction(text => document.getElementById('note-preview').textContent === text, example.document.src);
    return page.locator('#preview-panel');
  },
};
