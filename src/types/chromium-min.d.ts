declare module '@sparticuz/chromium-min' {
    const chromium: {
        args: string[];
        defaultViewport: {
            width: number;
            height: number;
            deviceScaleFactor: number;
        };
        executablePath: (chromiumPath?: string) => Promise<string>;
        headless: boolean | 'shell';
    };
    export default chromium;
} 