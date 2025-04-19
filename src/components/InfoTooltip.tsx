import { useState, useEffect, useRef } from 'react';

interface InfoTooltipProps {
  title: string;
  description: string;
  examples?: string[];
  notes?: string[];
  coefficient?: string;
}

export default function InfoTooltip({ title, description, examples, notes, coefficient }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => window.innerWidth > 768 && setIsOpen(true)}
        onMouseLeave={() => window.innerWidth > 768 && setIsOpen(false)}
      >
        <i className="fas fa-info-circle"></i>
      </button>

      {isOpen && (
        <div
          ref={tooltipRef}
          className="fixed md:absolute z-50 w-[90vw] md:w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-left 
                     md:mt-2 md:-right-2 
                     top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     md:top-auto md:left-auto md:transform-none
                     max-h-[80vh] md:max-h-none overflow-y-auto"
        >
          <div className="hidden md:block absolute -top-2 right-3 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
          <div className="relative">
            <button
              className="md:hidden absolute top-1 right-1 text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-700 text-sm mb-3">{description}</p>
            
            {coefficient && (
              <div className="mb-3">
                <span className="text-sm font-medium text-blue-900">Coefficiente:</span>
                <span className="text-sm text-gray-700 ml-2">{coefficient}</span>
              </div>
            )}

            {examples && examples.length > 0 && (
              <div className="mb-3">
                <span className="text-sm font-medium text-blue-900 block mb-1">Esempi:</span>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
            )}

            {notes && notes.length > 0 && (
              <div>
                <span className="text-sm font-medium text-blue-900 block mb-1">Note:</span>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 