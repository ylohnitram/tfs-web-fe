
import { useState } from 'react';
import type { PairInfo } from '@/types';

interface SymbolSelectorProps {
  pairs: PairInfo[];
  selectedSymbol: string;
  selectedTimeframe: string;
  onSymbolChange: (symbol: string) => void;
  onTimeframeChange: (timeframe: string) => void;
  isLoading: boolean;
}

const SymbolSelector = ({ 
  pairs, 
  selectedSymbol, 
  selectedTimeframe, 
  onSymbolChange, 
  onTimeframeChange,
  isLoading 
}: SymbolSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const availableTimeframes = pairs.find(p => p.symbol === selectedSymbol)?.timeframes || [];

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-8 bg-slate-700 rounded w-full"></div>
            <div className="space-y-2">
              <div className="h-8 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Symbol</label>
          <div className="relative">
            <button
              type="button"
              className="relative w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="block truncate text-white">{selectedSymbol}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            
            {isOpen && (
              <div className="absolute z-10 mt-1 w-full bg-slate-700 shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
                {pairs.map((pair) => (
                  <button
                    key={pair.symbol}
                    type="button"
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-600 ${
                      selectedSymbol === pair.symbol ? 'bg-blue-600 text-white' : 'text-white'
                    }`}
                    onClick={() => {
                      onSymbolChange(pair.symbol);
                      setIsOpen(false);
                    }}
                  >
                    {pair.symbol}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Timeframe</label>
          <div className="flex space-x-2">
            {availableTimeframes.map((timeframe) => (
              <button
                key={timeframe}
                type="button"
                className={`py-2 px-3 rounded-md font-medium ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
                onClick={() => onTimeframeChange(timeframe)}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolSelector;
