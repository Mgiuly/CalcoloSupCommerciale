import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import fs from 'fs/promises';
import path from 'path';
import { ChartData } from '../types/ChartData';
import { translations, Translation } from './translations';

interface AreaDetail {
    name: string;
    baseArea: number;
    coefficient: number;
    commercialArea: number;
    tiers?: {
        explanation: string;
        baseArea: number;
        coefficient: number;
        commercialArea: number;
    }[];
}

interface GenerateReportParams {
    totalArea: number;
    details: AreaDetail[];
    chartData: ChartData;
    language?: 'it' | 'en';
}

const formatNumber = (num: number, language: 'it' | 'en'): string => {
    const value = language === 'en' ? num * 10.7639 : num;
    return value.toLocaleString(language === 'en' ? 'en-US' : 'it-IT', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
};

const generateCalculationDetails = (details: AreaDetail[], language: 'it' | 'en'): string => {
    const t = translations[language] as Translation;
    const unit = language === 'en' ? 'sq ft' : 'mq';

    // Filter out details with zero area
    const nonZeroDetails = details.filter(detail => detail.baseArea > 0);

    return nonZeroDetails.map(detail => {
        const translatedName = (t.areas as Record<string, string>)[detail.name] || detail.name;
        let detailHtml = `
            <div class="calculation-card">
                <h3>${translatedName}</h3>
                <div class="flex justify-between items-center text-sm">
                    <span>${t.labels.baseArea}: ${formatNumber(detail.baseArea, language)} ${unit}</span>
                    <span>${t.labels.coefficient}: ${detail.coefficient.toFixed(3)}</span>
                </div>
        `;

        if (detail.tiers && detail.tiers.length > 0) {
            detailHtml += `
                <div class="tier-calculations">
                    ${detail.tiers.map(tier => `
                        <div class="tier-detail">
                            <p class="text-xs">${tier.explanation}</p>
                            <p class="text-xs">
                                ${formatNumber(tier.baseArea, language)} ${unit} × ${tier.coefficient.toFixed(3)} = ${formatNumber(tier.commercialArea, language)} ${unit}
                            </p>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        detailHtml += `
                <div class="text-right font-bold text-sm mt-1">
                    ${t.labels.commercialArea}: ${formatNumber(detail.commercialArea, language)} ${unit}
                </div>
            </div>
        `;

        return detailHtml;
    }).join('');
};

const generateChartImage = async (chartData: ChartData, language: 'it' | 'en'): Promise<string> => {
    // Basic chart configuration
    const colors: Record<string, string> = {
        'Superficie Lorda Principale': '#1e40af',    // blue
        'Balconi e Terrazze Scoperte': '#991b1b',    // red
        'Logge e Balconi Coperti': '#065f46',        // green
        'Giardino': '#1e293b',                       // slate
        'Posti Auto Coperti': '#4c1d95',             // purple
        'Accessori Connessi': '#0f172a',             // dark blue
        'Accessori Non Connessi': '#374151',         // gray
        'Portici': '#6b21a8',                        // purple
        'Verande': '#9a3412',                        // orange
        'Autorimesse': '#1f2937'                     // dark gray
    };

    // Filter and prepare data
    const validData = chartData.datasets[0].data
        .map((value, index) => ({
            value: Number(value),
            label: chartData.labels[index],
            originalLabel: chartData.labels[index]
        }))
        .filter(item => item.value > 0);

    // Calculate total and exact percentages
    const total = validData.reduce((sum, item) => sum + item.value, 0);
    const processedData = validData.map(item => {
        const exactPercentage = (item.value / total) * 100;
        const translatedLabel = translations[language].areas[item.label as keyof typeof translations['it']['areas']] || item.label;
        return {
            label: translatedLabel,
            percentage: exactPercentage,
            color: colors[item.originalLabel] || '#1e40af'
        };
    });

    const chartHtml = `
        <div style="width: 800px; height: 400px; margin: 0 auto; background: white;">
            <canvas id="distributionChart"></canvas>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
        <script>
            const ctx = document.getElementById('distributionChart').getContext('2d');
            
            const chartData = {
                labels: ${JSON.stringify(processedData.map(d => `${d.label} (${d.percentage.toFixed(1)}%)`))},
                percentages: ${JSON.stringify(processedData.map(d => d.percentage))},
                colors: ${JSON.stringify(processedData.map(d => d.color))}
            };

            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        data: chartData.percentages,
                        backgroundColor: chartData.colors,
                        borderWidth: 0,
                        spacing: 0,
                        weight: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        animateRotate: false,
                        animateScale: false
                    },
                    plugins: {
                        legend: {
                            position: 'right',
                            align: 'start',
                            labels: {
                                font: {
                                    size: 12,
                                    family: 'Arial',
                                    weight: 'bold'
                                },
                                padding: 20,
                                usePointStyle: true,
                                boxWidth: 10,
                                boxHeight: 10,
                                color: '#000000'
                            }
                        },
                        tooltip: {
                            enabled: false
                        }
                    },
                    layout: {
                        padding: {
                            left: 20,
                            right: 250,
                            top: 20,
                            bottom: 20
                        }
                    }
                }
            });
        </script>
    `;
    return chartHtml;
};

export const generatePDF = async ({
    totalArea,
    details,
    chartData,
    language = 'it'
}: GenerateReportParams): Promise<Buffer> => {
    try {
        // Read the template
        const templatePath = path.join(process.cwd(), 'src/templates/report-template.html');
        let template = await fs.readFile(templatePath, 'utf-8');

        // Read the logo
        const logoPath = path.join(process.cwd(), 'public/images/logo.png');
        let logoBase64 = '';
        try {
            const logoBuffer = await fs.readFile(logoPath);
            logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
        } catch {
            console.warn('Logo not found, continuing without it');
        }

        const t = translations[language];
        const unit = language === 'en' ? 'sq ft' : 'mq';

        // Replace placeholders in the template
        template = template.replace('{{LOGO}}', logoBase64);
        template = template.replace('{{TITLE}}', t.title);
        template = template.replace('{{TOTAL_AREA_LABEL}}', t.labels.totalArea);
        template = template.replace('{{TOTAL_AREA}}', `${formatNumber(totalArea, language)} ${unit}`);
        template = template.replace('{{CALCULATION_DETAILS}}', generateCalculationDetails(details, language));
        template = template.replace('{{CHART_PLACEHOLDER}}', await generateChartImage(chartData, language));
        template = template.replace('{{DISCLAIMER}}', t.labels.disclaimer);

        // Launch browser with AWS Lambda Chrome
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: true as boolean | 'shell',
        });

        const page = await browser.newPage();
        await page.setContent(template, {
            waitUntil: ['networkidle0', 'load', 'domcontentloaded']
        });

        // Generate PDF
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            }
        });

        await browser.close();
        return Buffer.from(pdf);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error generating PDF:', error.message);
        } else {
            console.error('Unknown error generating PDF');
        }
        throw error;
    }
};

export const generateHTML = async ({
    totalArea,
    details,
    chartData,
    language = 'it'
}: GenerateReportParams): Promise<string> => {
    try {
        // Read the template
        const templatePath = path.join(process.cwd(), 'src/templates/report-template.html');
        let template = await fs.readFile(templatePath, 'utf-8');

        // Read the logo
        const logoPath = path.join(process.cwd(), 'public/images/logo.png');
        let logoBase64 = '';
        try {
            const logoBuffer = await fs.readFile(logoPath);
            logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
        } catch {
            console.warn('Logo not found, using fallback text');
            logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        }
        
        // Generate chart image
        const chartImage = await generateChartImage(chartData, language);

        // Replace placeholders
        template = template
            .replace('{{LOGO_BASE64}}', logoBase64)
            .replace('{{lang}}', language)
            .replace('{{unit}}', language === 'en' ? 'sq ft' : 'mq')
            .replace('{{TOTAL_AREA}}', formatNumber(totalArea, language))
            .replace('{{CALCULATION_DETAILS}}', generateCalculationDetails(details, language))
            .replace('{{CHART_IMAGE}}', chartImage);

        return template;
    } catch (error) {
        console.error('Error generating HTML:', error);
        throw error;
    }
}; 