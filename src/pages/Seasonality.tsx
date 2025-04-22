import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchSeasonality } from '@/lib/api';
import type { MonthlySeasonality } from '@/types';

const Seasonality = () => {
  const symbol = 'BTCUSDT';

  // Fetch seasonality data
  const { data: seasonalityData, isLoading: isSeasonalityLoading } = useQuery({
    queryKey: ['seasonality', symbol],
    queryFn: () => fetchSeasonality(symbol),
    enabled: true,
  });

  const getCurrentMonth = () => {
    return new Date().getMonth() + 1;
  };

  const getMonthlyTrend = (percentage: number) => {
    if (percentage >= 56) return { trend: 'UP', color: 'bg-green-500', emoji: '🟢' };
    if (percentage <= 44) return { trend: 'DOWN', color: 'bg-red-500', emoji: '🔴' };
    return { trend: 'SIDEWAYS', color: 'bg-yellow-500', emoji: '🟡' };
  };

  // Get month name from month number
  const getMonthName = (month: number) => {
    const date = new Date(2000, month - 1, 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">BTC/USDT Seasonality Analysis</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {!isSeasonalityLoading && seasonalityData && (
            <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Monthly Historical Trends</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seasonalityData.months.map((month: MonthlySeasonality) => {
                  const trend = getMonthlyTrend(month.percentage);
                  return (
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
                          {trend.emoji}
                          <span 
                            className={`ml-1 text-xs px-2 py-0.5 rounded ${
                              trend.color.replace('bg-', 'text-')
                            }`}
                          >
                            {trend.trend}
                          </span>
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full ${trend.color}`} 
                          style={{ width: `${month.percentage}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Historical Probability</span>
                        <span>{month.percentage.toFixed(2)}%</span>
                      </div>
                    </div>
                  );
                })}
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
