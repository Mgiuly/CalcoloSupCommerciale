import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';

const getOptions = async () => {
    const isDev = !process.env.AWS_LAMBDA_FUNCTION_VERSION;
    const executablePath = isDev
        ? process.env.CHROME_EXECUTABLE_PATH
        : await chrome.executablePath;

    if (isDev && !executablePath) {
        throw new Error(
            'Chrome executable path is required for development. Set CHROME_EXECUTABLE_PATH environment variable.'
        );
    }

    const options = {
        args: chrome.args,
        executablePath: executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
    };

    if (!isDev) {
        options.args = [
            ...chrome.args,
            '--autoplay-policy=user-gesture-required',
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-client-side-phishing-detection',
            '--disable-component-update',
            '--disable-default-apps',
            '--disable-dev-shm-usage',
            '--disable-domain-reliability',
            '--disable-extensions',
            '--disable-features=AudioServiceOutOfProcess',
            '--disable-hang-monitor',
            '--disable-ipc-flooding-protection',
            '--disable-notifications',
            '--disable-offer-store-unmasked-wallet-cards',
            '--disable-popup-blocking',
            '--disable-print-preview',
            '--disable-prompt-on-repost',
            '--disable-renderer-backgrounding',
            '--disable-setuid-sandbox',
            '--disable-speech-api',
            '--disable-sync',
            '--hide-scrollbars',
            '--ignore-gpu-blacklist',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-default-browser-check',
            '--no-first-run',
            '--no-pings',
            '--no-sandbox',
            '--no-zygote',
            '--password-store=basic',
            '--use-gl=swiftshader',
            '--use-mock-keychain',
        ];
    }

    return options;
};

export async function getBrowser() {
    const options = await getOptions();
    return puppeteer.launch(options);
} 