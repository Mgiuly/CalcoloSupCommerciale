import { NextResponse } from 'next/server';
import { generatePDF } from '../../../utils/pdfGenerator';

// Explicitly set Node.js runtime
export const runtime = 'nodejs';
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
    console.log('Starting PDF generation in Node.js runtime...');
    try {
        const { data, language } = await request.json() as RequestData;
        
        console.log('Processing PDF generation with data:', {
            totalArea: data.totalArea,
            detailsCount: Object.keys(data.details).length,
            language,
            runtime: 'nodejs'
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
            language
        });

        if (!pdf) {
            console.error('PDF generation returned null or undefined');
            throw new Error('PDF generation failed - no data returned');
        }

        console.log('PDF generated successfully, sending response...');
        
        return new NextResponse(pdf, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=report_${language}.pdf`,
                'Cache-Control': 'no-store'
            }
        });
    } catch (error: unknown) {
        console.error('PDF Generation error:', error);
        
        return NextResponse.json(
            { 
                error: 'Failed to generate PDF',
                details: process.env.NODE_ENV === 'development' 
                    ? (error instanceof Error ? error.message : String(error)) 
                    : undefined,
                runtime: 'nodejs'
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