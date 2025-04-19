import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium-min';

let browser: any = null;

const chromiumArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox'
];

export async function getBrowser() {
    if (browser) return browser;

    if (process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT === 'production') {
        // Production environment (Vercel)
        browser = await puppeteerCore.launch({
            args: chromiumArgs,
            executablePath: await chromium.executablePath(),
            headless: true
        });
    } else {
        // Local development environment
        const localChromePath = process.platform === 'win32'
            ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
            : process.platform === 'linux'
                ? '/usr/bin/google-chrome'
                : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

        browser = await puppeteer.launch({
            args: chromiumArgs,
            executablePath: localChromePath,
            headless: true
        });
    }

    return browser;
} 