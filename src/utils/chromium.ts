import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium-min';

const remoteExecutablePath = 'https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar';
let browser: puppeteerCore.Browser | null = null;

export async function getBrowser() {
    if (browser) return browser;

    if (process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT === 'production') {
        browser = await puppeteerCore.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(remoteExecutablePath),
            headless: true,
        });
    } else {
        // Local development - use regular puppeteer
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
            executablePath: process.platform === 'win32'
                ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
                : process.platform === 'linux'
                    ? '/usr/bin/google-chrome'
                    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        });
    }

    return browser;
} 