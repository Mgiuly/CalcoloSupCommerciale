import chrome from 'chrome-aws-lambda';
import puppeteer, { Page } from 'puppeteer-core';

const getOptions = async () => {
    const isDev = process.env.NODE_ENV === 'development';
    
    const options = {
        args: chrome.args,
        executablePath: isDev 
            ? process.platform === 'win32'
                ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
                : process.platform === 'linux'
                ? '/usr/bin/google-chrome'
                : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
            : await chrome.executablePath,
        headless: isDev ? true : chrome.headless,
    };

    return options;
};

export async function getPage() {
    const options = await getOptions();
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    return page;
}

export async function closeBrowser(page: Page) {
    const browser = page.browser();
    await page.close();
    await browser.close();
} 