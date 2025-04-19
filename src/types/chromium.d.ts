declare module '@sparticuz/chromium' {
    const chromium: {
        args: string[];
        defaultViewport: {
            width: number;
            height: number;
            deviceScaleFactor: number;
        };
        executablePath: () => Promise<string>;
        headless: boolean | 'new';
    };
    export default chromium;
} 