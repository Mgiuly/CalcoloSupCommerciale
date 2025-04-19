import { NextResponse } from 'next/server';
import { generatePDF } from '../../../utils/pdfGenerator';

export async function GET() {
    try {
        // Sample test data
        const testData = {
            totalArea: 150.75,
            details: [
                {
                    name: 'Superficie Lorda Principale',
                    baseArea: 100,
                    coefficient: 1,
                    commercialArea: 100
                },
                {
                    name: 'Balconi e Terrazze Scoperte',
                    baseArea: 30,
                    coefficient: 0.3,
                    commercialArea: 9,
                    tiers: [
                        {
                            explanation: 'Primi 25mq con coefficiente 0.30',
                            baseArea: 25,
                            coefficient: 0.3,
                            commercialArea: 7.5
                        },
                        {
                            explanation: 'Rimanenti 5mq con coefficiente 0.10',
                            baseArea: 5,
                            coefficient: 0.1,
                            commercialArea: 0.5
                        }
                    ]
                },
                {
                    name: 'Giardino',
                    baseArea: 150,
                    coefficient: 0.1,
                    commercialArea: 15
                }
            ],
            chartData: {
                labels: ['Superficie Principale', 'Balconi', 'Giardino'],
                datasets: [{
                    data: [100, 9, 15],
                    backgroundColor: ['#1d4ed8', '#3b82f6', '#93c5fd']
                }]
            }
        };

        const pdf = await generatePDF(testData);
        
        return new NextResponse(pdf, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=test-report.pdf'
            }
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
} 