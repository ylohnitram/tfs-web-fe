import axios from 'axios';
import type { OHLCVResponse, SignalsResponse, SeasonalityResponse, PairsResponse } from '@/types';

// API base URL
const API_BASE_URL = 'https://api.tradefibsignals.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const fetchOHLCV = async (symbol: string, timeframe: string): Promise<OHLCVResponse | null> => {
  try {
    const response = await api.get<OHLCVResponse>(`/api/ohlcv/${symbol}/${timeframe}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching OHLCV data:', error);
    return null;
  }
};

export const fetchSignals = async (symbol: string, timeframe?: string): Promise<SignalsResponse | null> => {
  try {
    const endpoint = timeframe ? `/api/signals/${symbol}/${timeframe}` : `/api/signals/${symbol}`;
    const response = await api.get<SignalsResponse>(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching signals:', error);
    return null;
  }
};

export const fetchSeasonality = async (symbol: string): Promise<SeasonalityResponse | null> => {
  try {
    const response = await api.get<SeasonalityResponse>(`/api/seasonality/analysis/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching seasonality:', error);
    return null;
  }
};

export const fetchPairs = async (): Promise<PairsResponse | null> => {
  try {
    const response = await api.get<PairsResponse>('/api/pairs');
    return response.data;
  } catch (error) {
    console.error('Error fetching pairs:', error);
    return null;
  }
};

// Mock data for development
const mockOHLCVData = (symbol: string, timeframe: string): OHLCVResponse => {
  const now = Math.floor(Date.now() / 1000);
  const candles = [];
  
  // Create 100 candles with realistic-looking data
  let lastClose = 45000; // For BTC
  if (symbol === 'ETHUSDT') lastClose = 3200;
  if (symbol === 'SOLUSDT') lastClose = 120;
  
  // Timeframe in seconds
  const timeframeSeconds = 
    timeframe === '5m' ? 300 :
    timeframe === '15m' ? 900 :
    timeframe === '30m' ? 1800 : 3600; // Default to 1h
  
  for (let i = 0; i < 100; i++) {
    const timestamp = now - (99 - i) * timeframeSeconds;
    
    // Create realistic fluctuations
    const changePercent = (Math.random() * 2 - 1) * 1.5; // -1.5% to +1.5%
    const close = lastClose * (1 + changePercent / 100);
    const open = lastClose;
    const high = Math.max(open, close) * (1 + (Math.random() * 0.7) / 100);
    const low = Math.min(open, close) * (1 - (Math.random() * 0.7) / 100);
    const volume = Math.random() * 500 + 100;
    
    candles.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume,
    });
    
    lastClose = close;
  }
  
  return {
    symbol,
    timeframe,
    candles,
  };
};

const mockSignalsData = (symbol: string, timeframe?: string): SignalsResponse => {
  const signals = [];
  const defaultTimeframe = timeframe || '1h';
  
  for (let i = 0; i < 10; i++) {
    const isLong = Math.random() > 0.5;
    const entry = isLong ? 45000 + Math.random() * 1000 : 45000 - Math.random() * 1000;
    const sl = isLong ? entry * 0.98 : entry * 1.02;
    const tp = isLong ? entry * 1.03 : entry * 0.97;
    
    // Random status
    const statusOptions: Array<"WAITING" | "ENTRY_HIT" | "ACTIVE" | "TP_HIT" | "SL_HIT"> = [
      "WAITING", "ENTRY_HIT", "ACTIVE", "TP_HIT", "SL_HIT"
    ];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    signals.push({
      id: i + 1,
      symbol,
      timeframe: defaultTimeframe,
      type: isLong ? 'LONG' : 'SHORT',
      entry_price: entry,
      stop_loss: sl,
      take_profit: tp,
      risk_reward_ratio: Math.abs((tp - entry) / (entry - sl)),
      liquidity_level: {
        price: isLong ? sl * 0.99 : sl * 1.01,
        strength: Math.floor(Math.random() * 10) + 1,
        type: isLong ? 'BSL' : 'SSL',
        created_at: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
      seasonality_score: Math.floor(Math.random() * 100),
      is_valid: Math.random() > 0.2,
      status,
    });
  }
  
  return {
    symbol,
    signals,
  };
};

const mockSeasonalityData = (symbol: string): SeasonalityResponse => {
  const months = [];
  const currentYear = new Date().getFullYear();
  
  for (let month = 1; month <= 12; month++) {
    const positive_days = Math.floor(Math.random() * 20) + 10; // 10 to 30
    const total_days = month === 2 ? 28 : [4, 6, 9, 11].includes(month) ? 30 : 31;
    const percentage = (positive_days / total_days) * 100;
    
    let sentiment: 'bullish' | 'neutral' | 'bearish';
    if (percentage > 60) sentiment = 'bullish';
    else if (percentage < 45) sentiment = 'bearish';
    else sentiment = 'neutral';
    
    months.push({
      year: currentYear,
      month,
      positive_days,
      total_days,
      percentage,
      sentiment,
    });
  }
  
  // Calculate summary
  const bullish_months = months.filter(m => m.sentiment === 'bullish').length;
  const neutral_months = months.filter(m => m.sentiment === 'neutral').length;
  const bearish_months = months.filter(m => m.sentiment === 'bearish').length;
  const average_percentage = months.reduce((sum, m) => sum + m.percentage, 0) / months.length;
  
  return {
    symbol,
    months,
    summary: {
      bullish_months,
      neutral_months,
      bearish_months,
      average_percentage,
    },
  };
};

const mockPairsData = (): PairsResponse => {
  return {
    pairs: [
      {
        symbol: 'BTCUSDT',
        base_asset: 'BTC',
        quote_asset: 'USDT',
        is_active: true,
        timeframes: ['5m', '15m', '30m', '1h'],
        added_at: new Date().toISOString(),
      },
      {
        symbol: 'ETHUSDT',
        base_asset: 'ETH',
        quote_asset: 'USDT',
        is_active: true,
        timeframes: ['5m', '15m', '30m', '1h'],
        added_at: new Date().toISOString(),
      },
      {
        symbol: 'SOLUSDT',
        base_asset: 'SOL',
        quote_asset: 'USDT',
        is_active: true,
        timeframes: ['5m', '15m', '30m', '1h'],
        added_at: new Date().toISOString(),
      },
    ],
  };
};
