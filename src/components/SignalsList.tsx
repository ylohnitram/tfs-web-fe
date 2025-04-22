import { useMemo } from 'react';
import type { Signal, SeasonalitySentiment } from '@/types';

interface SignalsListProps {
  signals: Signal[];
  seasonalSentiment: SeasonalitySentiment;
  isLoading: boolean;
}

const SignalsList = ({ signals, seasonalSentiment, isLoading }: SignalsListProps) => {
  // Calculate RRR based on seasonality sentiment
  const calculateRRR = (signal: Signal) => {
    // Get base RRR depending on seasonality
    const baseRRR = seasonalSentiment === 'neutral' ? 2 : 3;
    
    // Calculate take profit price based on entry and RRR
    const distance = Math.abs(signal.entry_price - signal.stop_loss);
    const targetMove = distance * baseRRR;
    
    // Calculate new take profit price
    if (signal.type === 'LONG') {
      return {
        take_profit: signal.entry_price + targetMove,
        risk_reward_ratio: baseRRR
      };
    } else {
      return {
        take_profit: signal.entry_price - targetMove,
        risk_reward_ratio: baseRRR
      };
    }
  };

  // Apply RRR adjustments to signals and limit to 3 most recent
  const adjustedSignals = useMemo(() => {
    return signals
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3)
      .map(signal => {
        const { take_profit, risk_reward_ratio } = calculateRRR(signal);
        return {
          ...signal,
          take_profit,
          risk_reward_ratio
        };
      });
  }, [signals, seasonalSentiment]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WAITING':
        return 'bg-yellow-500';
      case 'ENTRY_HIT':
        return 'bg-green-500';
      case 'ACTIVE':
        return 'bg-blue-500';
      case 'TP_HIT':
        return 'bg-purple-500';
      case 'SL_HIT':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'WAITING':
        return '🟡';
      case 'ENTRY_HIT':
        return '🟢';
      case 'ACTIVE':
        return '🔵';
      case 'TP_HIT':
        return '🟣';
      case 'SL_HIT':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'WAITING':
        return 'Waiting for Entry';
      case 'ENTRY_HIT':
        return 'Entry Hit';
      case 'ACTIVE':
        return 'Active Position';
      case 'TP_HIT':
        return 'Take Profit Hit';
      case 'SL_HIT':
        return 'Stop Loss Hit';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Trading Signals</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Latest Trading Signals</h2>
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">Seasonality Filter:</span>
          <span 
            className={`px-2 py-1 rounded text-xs font-medium 
            ${seasonalSentiment === 'bullish' ? 'bg-green-500/20 text-green-400' : 
              seasonalSentiment === 'bearish' ? 'bg-red-500/20 text-red-400' : 
              'bg-yellow-500/20 text-yellow-400'}`}
          >
            {seasonalSentiment.toUpperCase()} ({seasonalSentiment === 'neutral' ? '2:1' : '3:1'} RRR)
          </span>
        </div>
      </div>

      {adjustedSignals.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No signals available for the current seasonality filter
        </div>
      ) : (
        <div className="space-y-4">
          {adjustedSignals.map((signal) => (
            <div key={signal.id} className="bg-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span 
                      className={`inline-block px-2 py-1 rounded text-xs font-medium mr-2 ${
                        signal.type === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {signal.type}
                    </span>
                    <span className="text-gray-300">{signal.symbol} / {signal.timeframe}</span>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-xs text-gray-400">Entry</div>
                      <div className="font-medium text-white">${signal.entry_price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Stop Loss</div>
                      <div className="font-medium text-red-400">${signal.stop_loss.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Take Profit</div>
                      <div className="font-medium text-green-400">${signal.take_profit.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-1">Status:</span>
                    <div className="flex items-center">
                      <span className="mr-1">{getStatusEmoji(signal.status)}</span>
                      <span 
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(signal.status)}/20 text-${getStatusColor(signal.status).replace('bg-', '')}-400`}
                      >
                        {getStatusText(signal.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-gray-400 mr-1">Score:</span>
                    <span 
                      className={`font-medium ${
                        signal.seasonality_score > 70 ? 'text-green-400' :
                        signal.seasonality_score > 40 ? 'text-yellow-400' : 'text-red-400'
                      }`}
                    >
                      {signal.seasonality_score}
                    </span>
                  </div>
                  
                  <div className="mt-1 flex items-center">
                    <span className="text-xs text-gray-400 mr-1">R/R:</span>
                    <span className="font-medium text-blue-400">{signal.risk_reward_ratio.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SignalsList;
