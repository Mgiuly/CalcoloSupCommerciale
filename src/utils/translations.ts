export type TranslationKey = keyof typeof translations.it;

export interface Translation {
    title: string;
    totalArea: string;
    categories: {
        [key: string]: string;
    };
    areas: {
        [key: string]: string;
    };
    labels: {
        [key: string]: string;
    };
    notes: {
        [key: string]: string;
    };
}

export const translations: { [key: string]: Translation } = {
    it: {
        title: 'Calcolo Superficie Commerciale',
        totalArea: 'Superficie Commerciale Totale',
        categories: {
            'Area Principale': 'Area Principale',
            'Aree Esterne': 'Aree Esterne',
            'Accessori': 'Accessori',
            'Parcheggi': 'Parcheggi'
        },
        areas: {
            'Superficie Lorda Principale': 'Superficie Lorda Principale',
            'Balconi e Terrazze Scoperte': 'Balconi e Terrazze Scoperte',
            'Logge e Balconi Coperti': 'Logge e Balconi Coperti',
            'Portici': 'Portici',
            'Verande': 'Verande',
            'Giardino': 'Giardino',
            'Accessori Connessi': 'Accessori Connessi',
            'Accessori Non Connessi': 'Accessori Non Connessi',
            'Autorimesse': 'Autorimesse',
            'Posti Auto Coperti': 'Posti Auto Coperti',
            'Posti Auto Scoperti': 'Posti Auto Scoperti'
        },
        labels: {
            'area': 'Area',
            'coefficient': 'Coefficiente',
            'commercialArea': 'Area Commerciale',
            'baseArea': 'Area Base',
            'details': 'Dettaglio Calcoli',
            'distribution': 'Distribuzione Aree',
            'coefficientsSummary': 'Riepilogo Coefficienti',
            'needHelp': 'Hai bisogno di una valutazione professionale?',
            'expertAvailable': 'I nostri esperti sono a tua disposizione per una consulenza personalizzata',
            'callNow': 'Chiama ora',
            'sendEmail': 'Invia email',
            'disclaimer': 'Questo calcolo è fornito a scopo informativo e si basa sui criteri della Borsa Immobiliare di Vicenza. Non sostituisce una perizia professionale.',
            'notes': 'Note'
        },
        notes: {
            'mainArea': 'Include superficie calpestabile, muri interni e perimetrali',
            'balconi': '0.30 fino a 25mq, 0.10 oltre',
            'accessoriConnessi': 'Con accesso diretto',
            'accessoriNonConnessi': 'Con accesso indiretto',
            'giardino': '0.10 fino a 25mq, 0.02 oltre'
        }
    },
    en: {
        title: 'Commercial Area Calculation',
        totalArea: 'Total Commercial Area',
        categories: {
            'Area Principale': 'Main Area',
            'Aree Esterne': 'External Areas',
            'Accessori': 'Accessories',
            'Parcheggi': 'Parking'
        },
        areas: {
            'Superficie Lorda Principale': 'Main Gross Area',
            'Balconi e Terrazze Scoperte': 'Uncovered Balconies and Terraces',
            'Logge e Balconi Coperti': 'Covered Loggias and Balconies',
            'Portici': 'Porches',
            'Verande': 'Verandas',
            'Giardino': 'Garden',
            'Accessori Connessi': 'Connected Accessories',
            'Accessori Non Connessi': 'Unconnected Accessories',
            'Autorimesse': 'Garages',
            'Posti Auto Coperti': 'Covered Parking Spaces',
            'Posti Auto Scoperti': 'Uncovered Parking Spaces'
        },
        labels: {
            'area': 'Area',
            'coefficient': 'Coefficient',
            'commercialArea': 'Commercial Area',
            'baseArea': 'Base Area',
            'details': 'Calculation Details',
            'distribution': 'Area Distribution',
            'coefficientsSummary': 'Applied Coefficients Summary',
            'needHelp': 'Need a Professional Real Estate Appraisal?',
            'expertAvailable': 'Our experts are available for a personalized consultation',
            'callNow': 'Call Now',
            'sendEmail': 'Send Email',
            'disclaimer': 'This calculation is provided for informational purposes and is based on the criteria of the Vicenza Real Estate Exchange. It does not replace a professional real estate appraisal.',
            'notes': 'Notes'
        },
        notes: {
            'mainArea': 'Includes living area, internal and perimeter walls',
            'balconi': '0.30 up to 25 sq ft, 0.10 beyond',
            'accessoriConnessi': 'With direct access',
            'accessoriNonConnessi': 'With indirect access',
            'giardino': '0.10 up to 25 sq ft, 0.02 beyond'
        }
    }
}; 