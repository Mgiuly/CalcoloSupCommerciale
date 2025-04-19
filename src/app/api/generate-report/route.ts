import { NextResponse } from 'next/server';
import { generatePDF } from '../../../utils/pdfGenerator';
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
        const selectedLanguage = language;
        
        if (format === 'pdf') {
            console.log('Processing PDF format request in Edge runtime...');
            try {
                console.log('Calling PDF generator with data:', {
                    totalArea: data.totalArea,
                    detailsCount: Object.keys(data.details).length,
                    language: selectedLanguage,
                    runtime: 'edge'
                });

                const pdf = await generatePDF({
                    totalArea: data.totalArea,
                    details: Object.entries(data.details).map(([name, detail]) => ({
                        name,
                        baseArea: detail.area,
                        coefficient: detail.coefficient,
                        commercialArea: detail.commercialArea,
                        tiers: detail.tiers
                    })),
                    chartData: data.chartData,
                    language: selectedLanguage
                });

                if (!pdf) {
                    console.error('PDF generation returned null or undefined in Edge runtime');
                    throw new Error('PDF generation failed - no data returned');
                }

                console.log('PDF generated successfully in Edge runtime, sending response...');
                return new NextResponse(pdf, {
                    headers: {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment; filename=report_${selectedLanguage}.pdf`,
                        'Cache-Control': 'no-store'
                    }
                });
            } catch (pdfError: unknown) {
                console.error('PDF Generation error in Edge runtime:');
                console.error(JSON.stringify({
                    error: pdfError instanceof Error ? {
                        name: pdfError.name,
                        message: pdfError.message,
                        stack: pdfError.stack
                    } : String(pdfError)
                }, null, 2));
                
                return NextResponse.json(
                    { 
                        error: 'Failed to generate PDF',
                        details: process.env.NODE_ENV === 'development' 
                            ? (pdfError instanceof Error ? pdfError.message : String(pdfError)) 
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
        } else {
            // Generate text report
            const t = translations[selectedLanguage];
            const conversionFactor = selectedLanguage === 'en' ? 10.7639 : 1;
            const unit_label = selectedLanguage === 'en' ? 'sq ft' : 'mq';
            
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
                    'Content-Disposition': `attachment; filename=report_${selectedLanguage}.txt`
                }
            });
        }
    } catch (error: unknown) {
        console.error('Request processing error in Edge runtime:');
        console.error(JSON.stringify({
            error: error instanceof Error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : String(error)
        }, null, 2));
        
        return NextResponse.json(
            { 
                error: 'Failed to process request',
                details: process.env.NODE_ENV === 'development' 
                    ? (error instanceof Error ? error.message : String(error)) 
                    : undefined,
                runtime: 'edge'
            }, 
            { 
                status: 400,
                headers: {
                    'Cache-Control': 'no-store'
                }
            }
        );
    }
} 