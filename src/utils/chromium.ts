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

const isDev = process.env.NODE_ENV !== 'production';
const CHROMIUM_PATH = 'https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar';

export async function getBrowser() {
    if (browser) return browser;

    try {
        browser = await puppeteerCore.launch({
            args: chromiumArgs,
            defaultViewport: chromium.defaultViewport,
            executablePath: isDev 
                ? process.platform === 'win32'
                    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
                    : process.platform === 'linux'
                        ? '/usr/bin/google-chrome'
                        : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
                : await chromium.executablePath(CHROMIUM_PATH),
            headless: true,
            ignoreHTTPSErrors: true
        });
        
        return browser;
    } catch (error) {
        console.error('Error launching browser:', error);
        throw error;
    }
} 