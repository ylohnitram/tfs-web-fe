
import { createChart, ColorType, UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import type { Candle } from '@/types';

interface CandlestickChartProps {
  data: Candle[];
  symbol: string;
  timeframe: string;
}

const CandlestickChart = ({ data, symbol, timeframe }: CandlestickChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    // Clear previous chart if it exists
    if (chartRef.current) {
      chartRef.current.remove();
    }

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: '#1E293B' },
        textColor: '#D1D5DB',
      },
      grid: {
        vertLines: {
          color: '#334155',
        },
        horzLines: {
          color: '#334155',
        },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: '#334155',
      },
      timeScale: {
        borderColor: '#334155',
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
      borderDownColor: '#EF4444',
      borderUpColor: '#10B981',
      wickDownColor: '#EF4444',
      wickUpColor: '#10B981',
    });

    // Transform data for the chart
    const formattedData = data.map((candle) => ({
      time: candle.timestamp as UTCTimestamp,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    candlestickSeries.setData(formattedData);

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [data]);

  return (
    <div className="w-full">
      <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">{symbol} / {timeframe}</h2>
          <div className="text-gray-400 text-sm">
            Last price: {data.length > 0 ? data[data.length - 1].close.toFixed(2) : 'Loading...'}
          </div>
        </div>
        <div ref={chartContainerRef} className="w-full" />
      </div>
    </div>
  );
};

export default CandlestickChart;
