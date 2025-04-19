import puppeteerCore, { Browser } from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

let browser: Browser | null = null;

const chromiumArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--single-process'
];

export async function getBrowser() {
    if (browser) return browser;

    try {
        browser = await puppeteerCore.launch({
            args: chromiumArgs,
            executablePath: await chromium.executablePath(),
            headless: true,
            ignoreHTTPSErrors: true
        });
        
        return browser;
    } catch (error) {
        console.error('Error launching browser:', error);
        throw error;
    }
} 