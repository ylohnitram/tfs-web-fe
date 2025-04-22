
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SignalsList from '@/components/SignalsList';
import SymbolSelector from '@/components/SymbolSelector';
import { fetchSignals, fetchSeasonality, fetchPairs } from '@/lib/api';
import type { SeasonalitySentiment } from '@/types';

const Signals = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('1h');
  const [selectedSentiment, setSelectedSentiment] = useState<SeasonalitySentiment>('neutral');

  // Fetch pairs data
  const { data: pairsData, isLoading: isPairsLoading } = useQuery({
    queryKey: ['pairs'],
    queryFn: fetchPairs,
  });

  // Fetch signals data
  const { data: signalsData, isLoading: isSignalsLoading } = useQuery({
    queryKey: ['signals', symbol, timeframe],
    queryFn: () => fetchSignals(symbol, timeframe),
    enabled: !!symbol && !!timeframe,
  });

  // Fetch seasonality data
  const { data: seasonalityData, isLoading: isSeasonalityLoading } = useQuery({
    queryKey: ['seasonality', symbol],
    queryFn: () => fetchSeasonality(symbol),
    enabled: !!symbol,
  });

  // Get current month's seasonality sentiment
  const getCurrentMonthSeasonality = (): SeasonalitySentiment => {
    if (!seasonalityData) return 'neutral';
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    const monthData = seasonalityData.months.find(
      (m) => m.month === currentMonth && m.year === currentYear
    );
    
    return monthData?.sentiment || 'neutral';
  };

  const currentMonthSeasonality = getCurrentMonthSeasonality();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Trading Signals</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Symbol Selector */}
          <SymbolSelector
            pairs={pairsData?.pairs || []}
            selectedSymbol={symbol}
            selectedTimeframe={timeframe}
            onSymbolChange={setSymbol}
            onTimeframeChange={setTimeframe}
            isLoading={isPairsLoading}
          />
          
          {/* Sentiment Filter */}
          <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-white">Seasonality Filter</h3>
                <p className="text-gray-400 text-sm">
                  Current month's sentiment: {' '}
                  <span className={`
                    ${currentMonthSeasonality === 'bullish' ? 'text-green-400' : 
                      currentMonthSeasonality === 'bearish' ? 'text-red-400' : 
                      'text-yellow-400'}`
                  }>
                    {currentMonthSeasonality.toUpperCase()}
                  </span>
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 rounded-md ${
                    selectedSentiment === 'bullish'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                  }`}
                  onClick={() => setSelectedSentiment('bullish')}
                >
                  🟢 Bullish
                </button>
                
                <button
                  className={`px-4 py-2 rounded-md ${
                    selectedSentiment === 'neutral'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
                  }`}
                  onClick={() => setSelectedSentiment('neutral')}
                >
                  🟡 Neutral
                </button>
                
                <button
                  className={`px-4 py-2 rounded-md ${
                    selectedSentiment === 'bearish'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                  }`}
                  onClick={() => setSelectedSentiment('bearish')}
                >
                  🔴 Bearish
                </button>
              </div>
            </div>
          </div>
          
          {/* Signals List */}
          <SignalsList
            signals={signalsData?.signals || []}
            seasonalSentiment={selectedSentiment}
            isLoading={isSignalsLoading}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Signals;
