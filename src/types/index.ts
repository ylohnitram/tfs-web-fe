
// Signal types
export type SignalType = 'LONG' | 'SHORT';
export type SignalStatus = 'WAITING' | 'ENTRY_HIT' | 'ACTIVE' | 'TP_HIT' | 'SL_HIT';
export type SeasonalitySentiment = 'bullish' | 'neutral' | 'bearish';

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OHLCVResponse {
  symbol: string;
  timeframe: string;
  candles: Candle[];
}

export interface LiquidityLevel {
  price: number;
  strength: number;
  type: 'BSL' | 'SSL';
  created_at: string;
}

export interface Signal {
  id: number;
  symbol: string;
  timeframe: string;
  type: SignalType;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  risk_reward_ratio: number;
  liquidity_level: LiquidityLevel;
  created_at: string;
  seasonality_score: number;
  is_valid: boolean;
  status: SignalStatus;
}

export interface SignalsResponse {
  symbol: string;
  signals: Signal[];
}

export interface MonthlySeasonality {
  year: number;
  month: number;
  positive_days: number;
  total_days: number;
  percentage: number;
  sentiment: SeasonalitySentiment;
  years_count?: number; // Added years_count property
}

export interface SeasonalityResponse {
  symbol: string;
  months: MonthlySeasonality[];
  summary: {
    bullish_months: number;
    neutral_months: number;
    bearish_months: number;
    average_percentage: number;
  };
}

export interface PairInfo {
  symbol: string;
  base_asset: string;
  quote_asset: string;
  is_active: boolean;
  timeframes: string[];
  added_at: string;
}

export interface PairsResponse {
  pairs: PairInfo[];
}
