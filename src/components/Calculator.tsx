'use client';

import { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import InputSection, { CalculationData } from './InputSection';
import ResultsSection from './ResultsSection';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CalculationResult {
  totalArea: number;
  details: {
    [key: string]: {
      area: number;
      coefficient: number;
      commercialArea: number;
      tiers?: {
        baseArea: number;
        coefficient: number;
        commercialArea: number;
        explanation: string;
      }[];
    };
  };
  chartData: {
    labels: string[];
    datasets: [{
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }];
  };
}

export default function Calculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateArea = (data: CalculationData) => {
    console.log('Calculating area with data:', data);
    
    const details: CalculationResult['details'] = {};
    let totalCommercialArea = 0;

    // Superficie Lorda Principale (Base)
    const mainArea = {
      area: data.supLordaPrincipale,
      coefficient: 1.00,
      commercialArea: data.supLordaPrincipale * 1.00
    };
    details['Superficie Lorda Principale'] = mainArea;
    totalCommercialArea += mainArea.commercialArea;

    // Balconi e Terrazze Scoperte (calcolo a scaglioni)
    if (data.supBalconiScoperti > 0) {
      const base = data.supLordaPrincipale;
      const tiers = [];
      let remainingArea = data.supBalconiScoperti;
      let totalBalconiArea = 0;

      // Scaglione 1: fino al 25% della base -> 1/3 (33.3%)
      const tier1Max = base * 0.25;
      const tier1Area = Math.min(remainingArea, tier1Max);
      if (tier1Area > 0) {
        const tier1CommercialArea = tier1Area * (1/3);
        tiers.push({
          baseArea: tier1Area,
          coefficient: 1/3,
          commercialArea: tier1CommercialArea,
          explanation: `Fino al 25% della base (${tier1Max.toFixed(2)}mq) -> coefficiente 1/3`
        });
        totalBalconiArea += tier1CommercialArea;
        remainingArea -= tier1Area;
      }

      // Scaglione 2: dal 25% al 50% della base -> 1/4 (25%)
      if (remainingArea > 0) {
        const tier2Max = base * 0.25; // Altri 25% della base
        const tier2Area = Math.min(remainingArea, tier2Max);
        const tier2CommercialArea = tier2Area * (1/4);
        tiers.push({
          baseArea: tier2Area,
          coefficient: 1/4,
          commercialArea: tier2CommercialArea,
          explanation: `Dal 25% al 50% della base -> coefficiente 1/4`
        });
        totalBalconiArea += tier2CommercialArea;
        remainingArea -= tier2Area;
      }

      // Scaglione 3: dal 50% al 100% della base -> 1/6 (16.7%)
      if (remainingArea > 0) {
        const tier3Max = base * 0.5; // Altri 50% della base
        const tier3Area = Math.min(remainingArea, tier3Max);
        const tier3CommercialArea = tier3Area * (1/6);
        tiers.push({
          baseArea: tier3Area,
          coefficient: 1/6,
          commercialArea: tier3CommercialArea,
          explanation: `Dal 50% al 100% della base -> coefficiente 1/6`
        });
        totalBalconiArea += tier3CommercialArea;
        remainingArea -= tier3Area;
      }

      // Scaglione 4: oltre il 100% della base -> 1/10 (10%)
      if (remainingArea > 0) {
        const tier4CommercialArea = remainingArea * (1/10);
        tiers.push({
          baseArea: remainingArea,
          coefficient: 1/10,
          commercialArea: tier4CommercialArea,
          explanation: `Oltre il 100% della base -> coefficiente 1/10`
        });
        totalBalconiArea += tier4CommercialArea;
      }

      details['Balconi e Terrazze Scoperte'] = {
        area: data.supBalconiScoperti,
        coefficient: totalBalconiArea / data.supBalconiScoperti, // coefficiente medio
        commercialArea: totalBalconiArea,
        tiers: tiers
      };
      totalCommercialArea += totalBalconiArea;
    }

    // Logge e Balconi Coperti
    const loggeBalconiCoperti = {
      area: data.supLoggeBalconiCoperti,
      coefficient: 1/2,
      commercialArea: data.supLoggeBalconiCoperti * (1/2)
    };
    details['Logge e Balconi Coperti'] = loggeBalconiCoperti;
    totalCommercialArea += loggeBalconiCoperti.commercialArea;

    // Portici
    const portici = {
      area: data.supPortici,
      coefficient: 1/2,
      commercialArea: data.supPortici * (1/2)
    };
    details['Portici'] = portici;
    totalCommercialArea += portici.commercialArea;

    // Verande
    const verande = {
      area: data.supVerande,
      coefficient: 2/3,
      commercialArea: data.supVerande * (2/3)
    };
    details['Verande'] = verande;
    totalCommercialArea += verande.commercialArea;

    // Accessori Connessi
    const accessoriConnessi = {
      area: data.supAccessoriConnessi,
      coefficient: 2/3,
      commercialArea: data.supAccessoriConnessi * (2/3)
    };
    details['Accessori Connessi'] = accessoriConnessi;
    totalCommercialArea += accessoriConnessi.commercialArea;

    // Accessori Non Connessi
    const accessoriNonConnessi = {
      area: data.supAccessoriNonConnessi,
      coefficient: 1/2,
      commercialArea: data.supAccessoriNonConnessi * (1/2)
    };
    details['Accessori Non Connessi'] = accessoriNonConnessi;
    totalCommercialArea += accessoriNonConnessi.commercialArea;

    // Giardino (calcolo a scaglioni)
    if (data.supGiardino > 0) {
      const base = data.supLordaPrincipale;
      const tiers = [];
      let remainingArea = data.supGiardino;
      let totalGiardinoArea = 0;

      // Scaglione 1: fino al 100% della base -> 1/6 (16.7%)
      const tier1Max = base * 1.0;
      const tier1Area = Math.min(remainingArea, tier1Max);
      if (tier1Area > 0) {
        const tier1CommercialArea = tier1Area * (1/6);
        tiers.push({
          baseArea: tier1Area,
          coefficient: 1/6,
          commercialArea: tier1CommercialArea,
          explanation: `Fino al 100% della base (${tier1Max.toFixed(2)}mq) -> coefficiente 1/6`
        });
        totalGiardinoArea += tier1CommercialArea;
        remainingArea -= tier1Area;
      }

      // Scaglione 2: dal 100% al 300% della base -> 1/10 (10%)
      if (remainingArea > 0) {
        const tier2Max = base * 2.0; // Altri 200% della base
        const tier2Area = Math.min(remainingArea, tier2Max);
        const tier2CommercialArea = tier2Area * (1/10);
        tiers.push({
          baseArea: tier2Area,
          coefficient: 1/10,
          commercialArea: tier2CommercialArea,
          explanation: `Dal 100% al 300% della base -> coefficiente 1/10`
        });
        totalGiardinoArea += tier2CommercialArea;
        remainingArea -= tier2Area;
      }

      // Scaglione 3: dal 300% al 500% della base -> 1/20 (5%)
      if (remainingArea > 0) {
        const tier3Max = base * 2.0; // Altri 200% della base
        const tier3Area = Math.min(remainingArea, tier3Max);
        const tier3CommercialArea = tier3Area * (1/20);
        tiers.push({
          baseArea: tier3Area,
          coefficient: 1/20,
          commercialArea: tier3CommercialArea,
          explanation: `Dal 300% al 500% della base -> coefficiente 1/20`
        });
        totalGiardinoArea += tier3CommercialArea;
        remainingArea -= tier3Area;
      }

      // Scaglione 4: oltre il 500% della base -> 1/50 (2%)
      if (remainingArea > 0) {
        const tier4CommercialArea = remainingArea * (1/50);
        tiers.push({
          baseArea: remainingArea,
          coefficient: 1/50,
          commercialArea: tier4CommercialArea,
          explanation: `Oltre il 500% della base -> coefficiente 1/50`
        });
        totalGiardinoArea += tier4CommercialArea;
      }

      details['Giardino'] = {
        area: data.supGiardino,
        coefficient: totalGiardinoArea / data.supGiardino, // coefficiente medio
        commercialArea: totalGiardinoArea,
        tiers: tiers
      };
      totalCommercialArea += totalGiardinoArea;
    }

    // Autorimesse
    const autorimesse = {
      area: data.supAutorimesse,
      coefficient: 2/3,
      commercialArea: data.supAutorimesse * (2/3)
    };
    details['Autorimesse'] = autorimesse;
    totalCommercialArea += autorimesse.commercialArea;

    // Posti Auto Coperti
    const postiAutoCoperti = {
      area: data.supPostiAutoCoperti,
      coefficient: 1/2,
      commercialArea: data.supPostiAutoCoperti * (1/2)
    };
    details['Posti Auto Coperti'] = postiAutoCoperti;
    totalCommercialArea += postiAutoCoperti.commercialArea;

    // Posti Auto Scoperti
    const postiAutoScoperti = {
      area: data.supPostiAutoScoperti,
      coefficient: 1/5,
      commercialArea: data.supPostiAutoScoperti * (1/5)
    };
    details['Posti Auto Scoperti'] = postiAutoScoperti;
    totalCommercialArea += postiAutoScoperti.commercialArea;

    // Prepare chart data
    const chartData = {
      labels: Object.keys(details),
      datasets: [{
        data: Object.values(details).map(d => d.commercialArea),
        backgroundColor: [
          '#2563eb', // blue-600
          '#3b82f6', // blue-500
          '#60a5fa', // blue-400
          '#93c5fd', // blue-300
          '#bfdbfe', // blue-200
          '#4b5563', // gray-600
          '#6b7280', // gray-500
          '#9ca3af', // gray-400
          '#d1d5db', // gray-300
          '#e5e7eb', // gray-200
          '#f3f4f6', // gray-100
        ],
        borderColor: [
          '#1e40af', // blue-800
          '#1d4ed8', // blue-700
          '#2563eb', // blue-600
          '#3b82f6', // blue-500
          '#60a5fa', // blue-400
          '#374151', // gray-700
          '#4b5563', // gray-600
          '#6b7280', // gray-500
          '#9ca3af', // gray-400
          '#d1d5db', // gray-300
          '#e5e7eb', // gray-200
        ],
        borderWidth: 1
      }] as [{
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
      }]
    };

    setResult({
      totalArea: totalCommercialArea,
      details,
      chartData
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Calcolo Superficie Commerciale
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calcola la superficie commerciale del tuo immobile in modo preciso e professionale
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <InputSection onCalculate={calculateArea} />
        </div>

        {result && (
          <div className="mt-8">
            <ResultsSection results={result} />
          </div>
        )}
      </div>
    </div>
  );
}