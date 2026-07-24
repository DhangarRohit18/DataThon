'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EChartWrapperProps {
  option: echarts.EChartsOption;
  style?: React.CSSProperties;
  className?: string;
}

export default function EChartWrapper({ option, style, className }: EChartWrapperProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, 'dark', {
        renderer: 'svg' // Use SVG renderer for sharper lines in dark themes
      });
    }

    // Set configuration options
    chartInstance.current.setOption({
      ...option,
      backgroundColor: 'transparent' // Force transparent background to integrate with our Dark Navy layouts
    });

    // Resize handler
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [option]);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: '350px', ...style }}
      className={className}
    />
  );
}
