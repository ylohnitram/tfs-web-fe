
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SymbolSelector from '@/components/SymbolSelector';
import { fetchSeasonality, fetchPairs } from '@/lib/api';
import type { MonthlySeasonality } from '@/types';

const Seasonality = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('1h');

  // Fetch pairs data
  const { data: pairsData, isLoading: isPairsLoading } = useQuery({
    queryKey: ['pairs'],
    queryFn: fetchPairs,
  });

  // Fetch seasonality data
  const { data: seasonalityData, isLoading: isSeasonalityLoading } = useQuery({
    queryKey: ['seasonality', symbol],
    queryFn: () => fetchSeasonality(symbol),
    enabled: !!symbol,
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'bg-green-500';
      case 'neutral':
        return 'bg-yellow-500';
      case 'bearish':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return '🟢';
      case 'neutral':
        return '🟡';
      case 'bearish':
        return '🔴';
      default:
        return '⚪';
    }
  };

  // Get month name from month number
  const getMonthName = (month: number) => {
    const date = new Date(2000, month - 1, 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  // Get current month number
  const getCurrentMonth = () => {
    return new Date().getMonth() + 1;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Seasonality Analysis</h1>
        
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
          
          {/* Summary */}
          {!isSeasonalityLoading && seasonalityData && (
            <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Yearly Summary</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Bullish Months</div>
                  <div className="text-xl font-semibold text-green-400">
                    {seasonalityData.summary.bullish_months}
                  </div>
                </div>
                
                <div className="bg-slate-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Neutral Months</div>
                  <div className="text-xl font-semibold text-yellow-400">
                    {seasonalityData.summary.neutral_months}
                  </div>
                </div>
                
                <div className="bg-slate-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Bearish Months</div>
                  <div className="text-xl font-semibold text-red-400">
                    {seasonalityData.summary.bearish_months}
                  </div>
                </div>
                
                <div className="bg-slate-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Average</div>
                  <div className="text-xl font-semibold text-blue-400">
                    {seasonalityData.summary.average_percentage.toFixed(2)}%
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-3">Monthly Breakdown</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seasonalityData.months.map((month: MonthlySeasonality) => (
                  <div 
                    key={`${month.year}-${month.month}`} 
                    className={`bg-slate-700 p-3 rounded-lg ${
                      month.month === getCurrentMonth() ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-white">
                        {getMonthName(month.month)} {month.year}
                      </span>
                      <span className="flex items-center">
                        {getSentimentEmoji(month.sentiment)}
                        <span 
                          className={`ml-1 text-xs px-2 py-0.5 rounded ${
                            getSentimentColor(month.sentiment).replace('bg-', 'bg-opacity-20 text-')
                          }-400`}
                        >
                          {month.sentiment.toUpperCase()}
                        </span>
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${getSentimentColor(month.sentiment)}`} 
                        style={{ width: `${month.percentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{month.positive_days} positive days</span>
                      <span>{month.percentage.toFixed(2)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Loading state */}
          {isSeasonalityLoading && (
            <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Yearly Summary</h2>
              <div className="animate-pulse space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-slate-700 rounded"></div>
                  ))}
                </div>
                <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-24 bg-slate-700 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Seasonality;
