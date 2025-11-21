import { browser } from 'k6/browser';
import { check } from 'k6';

export const options = {
    scenarios: {
        ui: {
            executor: 'shared-iterations',
            options: {
                browser: {
                    type: 'chromium',
                }
            }
        }
    }
};

export default async function () {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://effizientedemo.azurewebsites.net');
    const titleText = await page.locator('.title').textContent();
    check(titleText, {
        'page title is correct': (text) => text === 'Effiziente SW'
    });
    page.screenshot({ path: 'screenshot.png', fullPage: true });
    const usernameInput = page.locator('#company');
    await usernameInput.fill('Demo');
}
