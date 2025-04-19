import puppeteerCore, { Browser } from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';
import path from 'path';

let browser: Browser | null = null;

const chromiumArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--single-process'
];

const isDev = process.env.NODE_ENV !== 'production';

export async function getBrowser() {
    if (browser) return browser;

    try {
        const executablePath = isDev
            ? process.platform === 'win32'
                ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
                : process.platform === 'linux'
                    ? '/usr/bin/google-chrome'
                    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
            : path.join(process.cwd(), '.next/server/chunks/chromium/node_modules/@sparticuz/chromium-min/bin/chromium');

        browser = await puppeteerCore.launch({
            args: chromiumArgs,
            defaultViewport: chromium.defaultViewport,
            executablePath,
            headless: true,
            ignoreHTTPSErrors: true
        });
        
        return browser;
    } catch (error) {
        console.error('Error launching browser:', error);
        throw error;
    }
} 