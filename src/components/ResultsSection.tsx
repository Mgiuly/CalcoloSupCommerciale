import { Pie } from 'react-chartjs-2';
import { useState } from 'react';

interface ResultsSectionProps {
  results: {
    totalArea: number;
    details: {
      [key: string]: {
        area: number;
        coefficient: number;
        commercialArea: number;
        tiers?: {
          explanation: string;
          baseArea: number;
          coefficient: number;
          commercialArea: number;
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
  };
}

export default function ResultsSection({ results }: ResultsSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadReport = async (unit: 'mq' | 'sqft', format: 'pdf' | 'txt') => {
    try {
      setIsGenerating(true);
      
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format,
          data: results,
          language: unit === 'sqft' ? 'en' : 'it'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and click it
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${unit === 'sqft' ? 'en' : 'it'}.${format}`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Si è verificato un errore durante la generazione del report. Riprova più tardi.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
          <h3 className="text-2xl font-bold text-white text-center">
            Risultato del Calcolo
          </h3>
          <div className="mt-4 text-center">
            <p className="text-5xl font-bold text-white">
              {results.totalArea.toFixed(2)} mq
            </p>
            <p className="text-lg text-blue-100 mt-2">
              Superficie Commerciale Totale
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Distribuzione Aree
              </h4>
              <div className="aspect-square">
                <Pie data={results.chartData} options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 20
                      }
                    }
                  },
                  maintainAspectRatio: true
                }} />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Dettaglio Calcolo
              </h4>
              <div className="overflow-y-auto max-h-[500px] pr-4 space-y-4">
                {Object.entries(results.details).map(([key, value]) => {
                  if (key === 'Balconi e Terrazze Scoperte') {
                    if (value.area <= 25) {
                      return (
                        <div key={key} className="bg-white rounded-lg p-4 shadow-sm">
                          <h5 className="font-semibold text-blue-900 mb-2">{key}</h5>
                          <div className="text-sm space-y-1 text-gray-600">
                            <p>Area Lorda: <span className="font-medium text-gray-900">{value.area.toFixed(2)} mq</span></p>
                            <p className="mt-2 text-blue-900">
                              Area ≤ 25mq, si applica coefficiente 0.30 su tutta la superficie
                            </p>
                            <p>Coefficiente: <span className="font-medium text-gray-900">{value.coefficient.toFixed(3)}</span></p>
                            <p className="mt-2 text-blue-900 font-medium">
                              Area Commerciale Risultante: {value.commercialArea.toFixed(2)} mq
                            </p>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={key} className="bg-white rounded-lg p-4 shadow-sm">
                          <h5 className="font-semibold text-blue-900 mb-2">{key}</h5>
                          <div className="text-sm space-y-1 text-gray-600">
                            <p>Area Lorda: <span className="font-medium text-gray-900">{value.area.toFixed(2)} mq</span></p>
                            <p className="mt-2 text-blue-900">
                              Area {'>'} 25mq, si applica:
                            </p>
                            <ul className="list-disc list-inside ml-2">
                              <li>coefficiente 0.30 sui primi 25mq ({(25 * 0.30).toFixed(2)} mq)</li>
                              <li>coefficiente 0.10 sui restanti {(value.area - 25).toFixed(2)}mq ({((value.area - 25) * 0.10).toFixed(2)} mq)</li>
                            </ul>
                            <p className="mt-2">Coefficiente Medio: <span className="font-medium text-gray-900">{value.coefficient.toFixed(3)}</span></p>
                            <p className="mt-2 text-blue-900 font-medium">
                              Area Commerciale Risultante: {value.commercialArea.toFixed(2)} mq
                            </p>
                          </div>
                        </div>
                      );
                    }
                  } else if (key === 'Giardino') {
                    if (value.area <= 25) {
                      return (
                        <div key={key} className="bg-white rounded-lg p-4 shadow-sm">
                          <h5 className="font-semibold text-blue-900 mb-2">{key}</h5>
                          <div className="text-sm space-y-1 text-gray-600">
                            <p>Area Lorda: <span className="font-medium text-gray-900">{value.area.toFixed(2)} mq</span></p>
                            <p className="mt-2 text-blue-900">
                              Area ≤ 25mq, si applica coefficiente 0.10 su tutta la superficie
                            </p>
                            <p>Coefficiente: <span className="font-medium text-gray-900">{value.coefficient.toFixed(3)}</span></p>
                            <p className="mt-2 text-blue-900 font-medium">
                              Area Commerciale Risultante: {value.commercialArea.toFixed(2)} mq
                            </p>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={key} className="bg-white rounded-lg p-4 shadow-sm">
                          <h5 className="font-semibold text-blue-900 mb-2">{key}</h5>
                          <div className="text-sm space-y-1 text-gray-600">
                            <p>Area Lorda: <span className="font-medium text-gray-900">{value.area.toFixed(2)} mq</span></p>
                            <p className="mt-2 text-blue-900">
                              Area {'>'} 25mq, si applica:
                            </p>
                            <ul className="list-disc list-inside ml-2">
                              <li>coefficiente 0.10 sui primi 25mq ({(25 * 0.10).toFixed(2)} mq)</li>
                              <li>coefficiente 0.02 sui restanti {(value.area - 25).toFixed(2)}mq ({((value.area - 25) * 0.02).toFixed(2)} mq)</li>
                            </ul>
                            <p className="mt-2">Coefficiente Medio: <span className="font-medium text-gray-900">{value.coefficient.toFixed(3)}</span></p>
                            <p className="mt-2 text-blue-900 font-medium">
                              Area Commerciale Risultante: {value.commercialArea.toFixed(2)} mq
                            </p>
                          </div>
                        </div>
                      );
                    }
                  }

                  return (
                    <div key={key} className="bg-white rounded-lg p-4 shadow-sm">
                      <h5 className="font-semibold text-blue-900 mb-2">{key}</h5>
                      <div className="text-sm space-y-1 text-gray-600">
                        <p>Area Lorda: <span className="font-medium text-gray-900">{value.area.toFixed(2)} mq</span></p>
                        {value.tiers ? (
                          <>
                            <p className="mt-2 font-medium text-blue-900">Calcolo a Scaglioni:</p>
                            {value.tiers.map((tier, index) => (
                              <div key={index} className="ml-4 mt-1">
                                <p className="text-gray-600">{tier.explanation}</p>
                                <p className="text-gray-900">
                                  {tier.baseArea.toFixed(2)} mq × {(tier.coefficient).toFixed(3)} = {tier.commercialArea.toFixed(2)} mq
                                </p>
                              </div>
                            ))}
                            <p className="mt-2">
                              Coefficiente Medio: <span className="font-medium text-gray-900">{value.coefficient.toFixed(3)}</span>
                            </p>
                          </>
                        ) : (
                          <p>Coefficiente: <span className="font-medium text-gray-900">{value.coefficient.toFixed(3)}</span></p>
                        )}
                        <p className="mt-2 text-blue-900 font-medium">
                          Area Commerciale Risultante: {value.commercialArea.toFixed(2)} mq
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Riepilogo Coefficienti
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-900">Superficie Lorda Principale: <span className="font-medium">1.00</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-900">Balconi e Terrazze Scoperte: <span className="font-medium">0.30/0.10</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-900">Logge e Balconi Coperti: <span className="font-medium">0.35</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span className="text-gray-900">Portici: <span className="font-medium">0.35</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <span className="text-gray-900">Verande: <span className="font-medium">0.60</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-gray-900">Accessori Connessi: <span className="font-medium">0.50</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-900">Accessori Non Connessi: <span className="font-medium">0.25</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-gray-900">Giardino: <span className="font-medium">0.10/0.02</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-900">Autorimesse: <span className="font-medium">0.50</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-gray-900">Posti Auto Coperti: <span className="font-medium">0.30</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                <span className="text-gray-900">Posti Auto Scoperti: <span className="font-medium">0.20</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 items-center w-full max-w-md mx-auto px-4">
        <div className="flex flex-col gap-3 w-full">
          <button
            type="button"
            onClick={() => handleDownloadReport('mq', 'pdf')}
            disabled={isGenerating}
            className="w-full h-14 flex items-center justify-center bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-file-pdf text-lg"></i>
            <span className="ml-3">{isGenerating ? 'Generazione...' : 'Scarica PDF (IT)'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleDownloadReport('sqft', 'pdf')}
            disabled={isGenerating}
            className="w-full h-14 flex items-center justify-center bg-white text-blue-600 border-2 border-blue-600 font-semibold rounded-xl shadow-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-file-pdf text-lg"></i>
            <span className="ml-3">{isGenerating ? 'Generating...' : 'Download PDF (EN)'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleDownloadReport('mq', 'txt')}
            disabled={isGenerating}
            className="w-full h-14 flex items-center justify-center bg-gray-600 text-white font-semibold rounded-xl shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-file-text text-lg"></i>
            <span className="ml-3">Scarica TXT (IT)</span>
          </button>
          <button
            type="button"
            onClick={() => handleDownloadReport('sqft', 'txt')}
            disabled={isGenerating}
            className="w-full h-14 flex items-center justify-center bg-white text-gray-600 border-2 border-gray-600 font-semibold rounded-xl shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-file-text text-lg"></i>
            <span className="ml-3">Download TXT (EN)</span>
          </button>
        </div>
      </div>
    </div>
  );
}