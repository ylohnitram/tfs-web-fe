import { useEffect, useState } from 'react';
import type { MonthlySeasonality } from '@/types';

interface SeasonalityAnalysisProps {
  monthlySeasonality: MonthlySeasonality | null;
  isLoading: boolean;
}

const SeasonalityAnalysis = ({ monthlySeasonality, isLoading }: SeasonalityAnalysisProps) => {
  const [currentMonth, setCurrentMonth] = useState<string>('');
  
  useEffect(() => {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    setCurrentMonth(month);
  }, []);

  const getMonthlyTrend = (percentage: number) => {
    if (percentage >= 56) return { trend: 'UP', color: 'bg-green-500', emoji: '🟢' };
    if (percentage <= 44) return { trend: 'DOWN', color: 'bg-red-500', emoji: '🔴' };
    return { trend: 'SIDEWAYS', color: 'bg-yellow-500', emoji: '🟡' };
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 shadow-lg h-full">
        <h2 className="text-xl font-semibold text-white mb-4">Seasonality Analysis</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-700 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!monthlySeasonality) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 shadow-lg h-full">
        <h2 className="text-xl font-semibold text-white mb-4">Seasonality Analysis</h2>
        <div className="text-gray-400 text-center py-4">No seasonality data available</div>
      </div>
    );
  }

  const yearsCount = monthlySeasonality?.years_count || 0;

  const trend = getMonthlyTrend(monthlySeasonality.percentage);

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Seasonality Analysis - {currentMonth}</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white">Monthly Trend:</span>
          <span className="text-white font-semibold flex items-center">
            {trend.emoji} <span className="ml-2">{trend.trend}</span>
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${trend.color}`} 
            style={{ width: `${monthlySeasonality.percentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">        
        <div className="bg-slate-700 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Historical Probability</div>
          <div className="text-xl font-semibold text-white">{monthlySeasonality.percentage.toFixed(2)}%</div>
          <div className="text-sm text-gray-400 mt-1">
            Based on historical data from {yearsCount} years
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 rounded-lg bg-blue-900/30 border border-blue-800/50">
        <h3 className="text-blue-300 font-medium mb-1">Trading Hint</h3>
        <p className="text-gray-300 text-sm">
          {trend.trend === 'UP' && 'Historical data suggests a strong bullish bias for this month.'}
          {trend.trend === 'SIDEWAYS' && 'Historical data suggests a ranging market for this month.'}
          {trend.trend === 'DOWN' && 'Historical data suggests a strong bearish bias for this month.'}
        </p>
      </div>
    </div>
  );
};

export default SeasonalityAnalysis;
