
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CandlestickChart from '@/components/CandlestickChart';
import SeasonalityAnalysis from '@/components/SeasonalityAnalysis';
import SignalsList from '@/components/SignalsList';
import SymbolSelector from '@/components/SymbolSelector';
import { fetchOHLCV, fetchSignals, fetchSeasonality, fetchPairs } from '@/lib/api';
import type { MonthlySeasonality } from '@/types';

const Dashboard = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('1h');
  const [currentMonthSeasonality, setCurrentMonthSeasonality] = useState<MonthlySeasonality | null>(null);

  // Fetch pairs data
  const { data: pairsData, isLoading: isPairsLoading } = useQuery({
    queryKey: ['pairs'],
    queryFn: fetchPairs,
  });

  // Fetch OHLCV data
  const { data: ohlcvData, isLoading: isOhlcvLoading } = useQuery({
    queryKey: ['ohlcv', symbol, timeframe],
    queryFn: () => fetchOHLCV(symbol, timeframe),
    enabled: !!symbol && !!timeframe,
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

  // Set current month seasonality
  useEffect(() => {
    if (seasonalityData) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
      const currentYear = currentDate.getFullYear();
      
      const monthData = seasonalityData.months.find(
        (m) => m.month === currentMonth && m.year === currentYear
      );
      
      if (monthData) {
        setCurrentMonthSeasonality(monthData);
      }
    }
  }, [seasonalityData]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Trading Dashboard</h1>
        
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
          
          {/* Chart */}
          <div>
            {isOhlcvLoading ? (
              <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
                <div className="h-96 bg-slate-700 rounded animate-pulse"></div>
              </div>
            ) : (
              <CandlestickChart
                data={ohlcvData?.candles || []}
                symbol={symbol}
                timeframe={timeframe}
              />
            )}
          </div>
          
          {/* Seasonality and Signals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Seasonality Analysis */}
            <div className="md:col-span-1">
              <SeasonalityAnalysis
                monthlySeasonality={currentMonthSeasonality}
                isLoading={isSeasonalityLoading}
              />
            </div>
            
            {/* Signals */}
            <div className="md:col-span-2">
              <SignalsList
                signals={signalsData?.signals || []}
                seasonalSentiment={currentMonthSeasonality?.sentiment || 'neutral'}
                isLoading={isSignalsLoading}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
