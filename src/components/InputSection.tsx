'use client';

import { FormEvent } from 'react';
import InfoTooltip from './InfoTooltip';

interface InputSectionProps {
  onCalculate: (data: CalculationData) => void;
}

export interface CalculationData {
  supLordaPrincipale: number;
  supBalconiScoperti: number;
  supLoggeBalconiCoperti: number;
  supPortici: number;
  supVerande: number;
  supAccessoriConnessi: number;
  supAccessoriNonConnessi: number;
  supGiardino: number;
  supAutorimesse: number;
  supPostiAutoCoperti: number;
  supPostiAutoScoperti: number;
  etaImmobile: number;
}

export default function InputSection({ onCalculate }: InputSectionProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: CalculationData = {
      supLordaPrincipale: Number(formData.get('supLordaPrincipale')) || 0,
      supBalconiScoperti: Number(formData.get('supBalconiScoperti')) || 0,
      supLoggeBalconiCoperti: Number(formData.get('supLoggeBalconiCoperti')) || 0,
      supPortici: Number(formData.get('supPortici')) || 0,
      supVerande: Number(formData.get('supVerande')) || 0,
      supAccessoriConnessi: Number(formData.get('supAccessoriConnessi')) || 0,
      supAccessoriNonConnessi: Number(formData.get('supAccessoriNonConnessi')) || 0,
      supGiardino: Number(formData.get('supGiardino')) || 0,
      supAutorimesse: Number(formData.get('supAutorimesse')) || 0,
      supPostiAutoCoperti: Number(formData.get('supPostiAutoCoperti')) || 0,
      supPostiAutoScoperti: Number(formData.get('supPostiAutoScoperti')) || 0,
      etaImmobile: Number(formData.get('etaImmobile')) || 0,
    };
    onCalculate(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Area Principale */}
      <section className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
          <i className="fas fa-house text-blue-600"></i>
          Area Principale
        </h2>
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <i className="fas fa-ruler-combined text-blue-600 mr-2"></i>
              Superficie Lorda Principale
              <InfoTooltip
                title="Superficie Lorda Principale"
                description="La superficie lorda dell'unità immobiliare comprensiva di tutti i muri perimetrali, calcolati al 100% nel caso in cui non confinino con altre unità immobiliari o parti comuni e al 50% nel caso contrario."
                coefficient="1.00"
                examples={[
                  "Superficie abitabile principale",
                  "Mansarda abitabile collegata (h > 1.70m) accatastata come abitazione",
                  "Muri interni e perimetrali (100%)",
                  "Muri confinanti con altre unità (50%)"
                ]}
                notes={[
                  "Include la proiezione delle scale interne (solo per il piano di accesso)",
                  "Include le mansarde abitabili collegate con h > 1.70m se accatastate come abitazione",
                  "Eventuali vani tecnici vanno considerati al 50% della superficie"
                ]}
              />
            </label>
            <input
              type="number"
              name="supLordaPrincipale"
              step="0.01"
              min="0"
              placeholder="es. 110.50"
              className="mt-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
              required
            />
          </div>
        </div>
      </section>

      {/* Aree Esterne */}
      <section className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
          <i className="fas fa-tree text-blue-600"></i>
          Aree Esterne
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <i className="fas fa-sun text-blue-600 mr-2"></i>
              Balconi e Terrazze Scoperte
              <InfoTooltip
                title="Balconi e Terrazze Scoperte"
                description="Superfici esterne calpestabili a cielo aperto. Il coefficiente varia in base alla dimensione rispetto alla superficie principale."
                coefficient="Variabile in base alla superficie: 1/3 fino al 25% della sup. principale, 1/4 dal 25% al 50%, 1/6 dal 50% al 100%, 1/10 oltre"
                examples={[
                  "Balconi aperti",
                  "Terrazze scoperte",
                  "Lastrico solare di proprietà esclusiva"
                ]}
                notes={[
                  "La superficie viene calcolata fino al bordo esterno",
                  "Per terrazze a livello (attici) utilizzare gli stessi coefficienti"
                ]}
              />
            </label>
            <input
              type="number"
              name="supBalconiScoperti"
              step="0.01"
              min="0"
              placeholder="es. 20.00"
              className="mt-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <i className="fas fa-umbrella text-blue-600 mr-2"></i>
              Logge e Balconi Coperti
              <InfoTooltip
                title="Logge e Balconi Coperti"
                description="Superfici esterne coperte e chiuse su almeno 2 lati. Include balconi incassati nella facciata e logge."
                coefficient="0.35"
                examples={[
                  "Balconi coperti dal piano superiore",
                  "Logge incassate nella facciata",
                  "Balconi con tettoia fissa"
                ]}
                notes={[
                  "La copertura deve essere strutturale e permanente",
                  "La superficie va calcolata fino al bordo esterno"
                ]}
              />
            </label>
            <input
              type="number"
              name="supLoggeBalconiCoperti"
              step="0.01"
              min="0"
              placeholder="es. 15.00"
              className="mt-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <i className="fas fa-archway text-blue-600 mr-2"></i>
              Portici
              <InfoTooltip
                title="Portici"
                description="Spazi coperti situati al piano terra, aperti su almeno un lato."
                coefficient="0.35"
                examples={[
                  "Portico d'ingresso",
                  "Portico sul giardino",
                  "Area coperta di accesso"
                ]}
                notes={[
                  "Deve essere parte integrante dell'edificio",
                  "La superficie va calcolata fino al bordo esterno della copertura"
                ]}
              />
            </label>
            <input
              type="number"
              name="supPortici"
              step="0.01"
              min="0"
              placeholder="es. 10.00"
              className="mt-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <i className="fas fa-door-open text-blue-600 mr-2"></i>
              Verande
              <InfoTooltip
                title="Verande"
                description="Balconi o terrazze chiuse su tutti i lati con strutture fisse (vetrate)."
                coefficient="0.60"
                examples={[
                  "Terrazza chiusa con vetrate",
                  "Balcone trasformato in veranda",
                  "Serra solare"
                ]}
                notes={[
                  "La chiusura deve essere con infissi permanenti",
                  "Deve essere regolarmente autorizzata"
                ]}
              />
            </label>
            <input
              type="number"
              name="supVerande"
              step="0.01"
              min="0"
              placeholder="es. 8.00"
              className="mt-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <i className="fas fa-tree text-blue-600 mr-2"></i>
              Giardino
              <InfoTooltip
                title="Giardino"
                description="Area verde di pertinenza esclusiva dell'unità immobiliare."
                coefficient="Variabile: 1/6 fino al 100% della sup. principale, 1/10 dal 100% al 300%, 1/20 oltre"
                examples={[
                  "Giardino privato",
                  "Area verde esclusiva",
                  "Cortile sistemato a verde"
                ]}
                notes={[
                  "Include vialetti e zone pavimentate",
                  "Escluse le aree di manovra per auto",
                  "Per aree molto grandi, valutare la reale pertinenzialità"
                ]}
              />
            </label>
            <input
              type="number"
              name="supGiardino"
              step="0.01"
              min="0"
              placeholder="es. 50.00"
              className="mt-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </section>

      {/* Accessori */}
      <section className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
          <i className="fas fa-box text-blue-600"></i>
          Accessori
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <i className="fas fa-link text-blue-600 mr-2"></i>
              Accessori Connessi
              <InfoTooltip
                title="Accessori Connessi"
                description="Locali accessori con accesso diretto dall'unità principale o dal vano scale comune, non accatastati come abitazione."
                coefficient="0.50"
                examples={[
                  "Soffitta collegata (h > 1.70m) accatastata come locale accessorio",
                  "Taverna collegata non abitabile",
                  "Deposito con accesso diretto"
                ]}
                notes={[
                  "Deve esserci continuità d'uso con l'unità principale",
                  "L'accesso deve essere diretto o dal vano scale comune",
                  "Per soffitte/sottotetti, considerare solo le parti con h > 1.70m",
                  "Non include le mansarde abitabili accatastate come abitazione (da inserire nella superficie principale)"
                ]}
              />
            </label>
            <input
              type="number"
              name="supAccessoriConnessi"
              step="0.01"
              min="0"
              placeholder="es. 20.00"
              className="mt-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <i className="fas fa-unlink text-blue-600 mr-2"></i>
              Accessori Non Connessi
              <InfoTooltip
                title="Accessori Non Connessi"
                description="Locali accessori senza accesso diretto dall'unità principale, non accatastati come abitazione."
                coefficient="0.25"
                examples={[
                  "Soffitta non collegata (h > 1.70m)",
                  "Cantina esterna",
                  "Deposito separato"
                ]}
                notes={[
                  "L'accesso avviene da parti comuni o dall'esterno",
                  "Per soffitte/sottotetti, considerare solo le parti con h > 1.70m",
                  "Le parti con h < 1.70m non vanno conteggiate",
                  "Non include le mansarde abitabili accatastate come abitazione (da inserire nella superficie principale)"
                ]}
              />
            </label>
            <input
              type="number"
              name="supAccessoriNonConnessi"
              step="0.01"
              min="0"
              placeholder="es. 10.00"
              className="mt-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </section>

      {/* Parcheggi */}
      <section className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
          <i className="fas fa-car text-blue-600"></i>
          Parcheggi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <i className="fas fa-warehouse text-blue-600 mr-2"></i>
              Autorimesse
              <InfoTooltip
                title="Autorimesse"
                description="Box auto chiuso con accesso carrabile."
                coefficient="0.50"
                examples={[
                  "Box auto singolo",
                  "Posto auto in autorimessa chiusa",
                  "Garage privato"
                ]}
                notes={[
                  "Deve essere un volume chiuso e delimitato",
                  "Include spazi di manovra interni al box"
                ]}
              />
            </label>
            <input
              type="number"
              name="supAutorimesse"
              step="0.01"
              min="0"
              placeholder="es. 15.00"
              className="mt-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <i className="fas fa-car-side text-blue-600 mr-2"></i>
              Posti Auto Coperti
              <InfoTooltip
                title="Posti Auto Coperti"
                description="Area destinata a parcheggio coperta ma non chiusa."
                coefficient="0.30"
                examples={[
                  "Posto auto sotto tettoia",
                  "Posto auto in porticato",
                  "Posto auto coperto condominiale assegnato"
                ]}
                notes={[
                  "La copertura deve essere strutturale",
                  "L'area deve essere specificamente destinata e delimitata"
                ]}
              />
            </label>
            <input
              type="number"
              name="supPostiAutoCoperti"
              step="0.01"
              min="0"
              placeholder="es. 12.50"
              className="mt-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <i className="fas fa-parking text-blue-600 mr-2"></i>
              Posti Auto Scoperti
              <InfoTooltip
                title="Posti Auto Scoperti"
                description="Area esterna destinata a parcheggio."
                coefficient="0.20"
                examples={[
                  "Posto auto all'aperto",
                  "Area di parcheggio assegnata",
                  "Posto auto in cortile"
                ]}
                notes={[
                  "L'area deve essere specificamente destinata",
                  "Deve essere chiaramente delimitata",
                  "Non include aree di manovra comuni"
                ]}
              />
            </label>
            <input
              type="number"
              name="supPostiAutoScoperti"
              step="0.01"
              min="0"
              placeholder="es. 12.50"
              className="mt-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Calcola Superficie Commerciale
        </button>
      </div>
    </form>
  );
}