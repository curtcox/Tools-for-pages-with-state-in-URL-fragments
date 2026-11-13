import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '../tests',
  use: { baseURL: process.env.FRAGMENT_KIT_BASE_URL },
});
