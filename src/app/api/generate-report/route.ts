import { NextResponse } from 'next/server';
import { translations } from '../../../utils/translations';

export const runtime = 'edge';
export const maxDuration = 60;

type Language = 'en' | 'it';

interface Detail {
    area: number;
    coefficient: number;
    commercialArea: number;
    tiers?: {
        explanation: string;
        baseArea: number;
        coefficient: number;
        commercialArea: number;
    }[];
}

interface RequestData {
    format: 'pdf' | 'txt';
    language: Language;
    data: {
        totalArea: number;
        details: Record<string, Detail>;
        chartData: {
            labels: string[];
            datasets: [{
                data: number[];
                backgroundColor: string[];
                borderColor: string[];
                borderWidth: number;
            }];
        };
    };
}

export async function POST(request: Request) {
    console.log('Starting report generation request in Edge runtime...');
    try {
        const { format, data, language } = await request.json() as RequestData;
        
        if (format === 'pdf') {
            // For PDF generation, forward the request to the PDF endpoint
            const url = new URL('/api/pdf', request.url);
            const pdfRequest = new Request(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data, language })
            });
            return fetch(pdfRequest);
        }

        // Generate text report
        const t = translations[language];
        const conversionFactor = language === 'en' ? 10.7639 : 1;
        const unit_label = language === 'en' ? 'sq ft' : 'mq';
        
        const categories = {
            'Area Principale': ['Superficie Lorda Principale'],
            'Aree Esterne': ['Balconi e Terrazze Scoperte', 'Logge e Balconi Coperti', 'Portici', 'Verande', 'Giardino'],
            'Accessori': ['Accessori Connessi', 'Accessori Non Connessi'],
            'Parcheggi': ['Autorimesse', 'Posti Auto Coperti', 'Posti Auto Scoperti']
        } as const;

        let reportText = `${t.title.toUpperCase()}\n`;
        reportText += `${''.padEnd(t.title.length, '=')}\n\n`;
        reportText += `${t.totalArea}: ${(data.totalArea * conversionFactor).toFixed(2)} ${unit_label}\n\n`;
        
        for (const [category, items] of Object.entries(categories)) {
            const translatedCategory = t.categories[category as keyof typeof t.categories];
            reportText += `${translatedCategory.toUpperCase()}\n`;
            reportText += ''.padEnd(translatedCategory.length, '-') + '\n';
            
            for (const item of items) {
                if (data.details[item]) {
                    const detail = data.details[item] as Detail;
                    const area = (detail.area * conversionFactor).toFixed(2);
                    const commercialArea = (detail.commercialArea * conversionFactor).toFixed(2);
                    const translatedName = t.areas[item as keyof typeof t.areas];
                    reportText += `${translatedName}:\n`;
                    reportText += `  ${t.labels.area}: ${area} ${unit_label}\n`;
                    reportText += `  ${t.labels.coefficient}: ${detail.coefficient}\n`;
                    reportText += `  ${t.labels.commercialArea}: ${commercialArea} ${unit_label}\n\n`;
                }
            }
        }

        reportText += `\n${t.labels.disclaimer}`;

        return new NextResponse(reportText, {
            headers: {
                'Content-Type': 'text/plain',
                'Content-Disposition': `attachment; filename=report_${language}.txt`,
                'Cache-Control': 'no-store'
            }
        });
    } catch (error: unknown) {
        console.error('Request processing error in Edge runtime:', error);
        return NextResponse.json(
            { 
                error: 'Failed to process request',
                details: process.env.NODE_ENV === 'development' 
                    ? (error instanceof Error ? error.message : String(error)) 
                    : undefined,
                runtime: 'edge'
            }, 
            { 
                status: 500,
                headers: {
                    'Cache-Control': 'no-store'
                }
            }
        );
    }
} 