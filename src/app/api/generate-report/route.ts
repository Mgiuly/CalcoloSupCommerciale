import { NextResponse } from 'next/server';
import { generatePDF } from '../../../utils/pdfGenerator';
import { translations } from '../../../utils/translations';

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
    try {
        const { format, data, language } = await request.json() as RequestData;
        const selectedLanguage = language;
        
        if (format === 'pdf') {
            try {
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
                    throw new Error('PDF generation failed - no data returned');
                }

                return new NextResponse(pdf, {
                    headers: {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment; filename=report_${selectedLanguage}.pdf`
                    }
                });
            } catch (pdfError) {
                console.error('PDF Generation error:', pdfError);
                return NextResponse.json(
                    { 
                        error: 'Failed to generate PDF',
                        details: process.env.NODE_ENV === 'development' ? pdfError.message : undefined
                    }, 
                    { status: 500 }
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
    } catch (error) {
        console.error('Request processing error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to process request',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }, 
            { status: 400 }
        );
    }
} 