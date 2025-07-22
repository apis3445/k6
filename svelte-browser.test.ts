import { browser } from 'k6/browser';
import { check } from 'k6';

export const options = {
  scenarios: {
    browser: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
}

export default async function () {
  const page = await browser.newPage();


  await page.goto('https://quickpizza.grafana.com');

  // Wait for the page to load and JavaScript to execute
  await page.waitForLoadState('networkidle');

  // You can also wait for specific elements to appear
  await page.waitForSelector('body', { timeout: 5000 });

  // Check for specific content that appears after JS execution
  const bodyText = await page.textContent('body');

  check(page, {
    'page loaded successfully': () => page.url().includes('quickpizza.grafana.com'),
    'body contains expected Pizza': () => bodyText?.includes('Pizza') || false,
  });

  await page.close();

}