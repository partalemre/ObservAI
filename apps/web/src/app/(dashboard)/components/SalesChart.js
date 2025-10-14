import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import { Skeleton } from '../../../components/ui'
export const SalesChart = ({ data, loading }) => {
  const chartOption = useMemo(() => {
    if (!data?.hourly) return null
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(26, 24, 37, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textStyle: {
          color: '#ffffff',
        },
        formatter: (params) => {
          const time = params[0]?.axisValue
          const sales = params[0]?.value
          const orders = params[1]?.value
          return `
            <div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${time}</div>
              <div style="color: #3b82f6;">● Satış: ${sales?.toLocaleString('tr-TR')} ₺</div>
              <div style="color: #f59e0b;">● Sipariş: ${orders} adet</div>
            </div>
          `
        },
      },
      legend: {
        data: ['Satış', 'Sipariş Sayısı'],
        textStyle: {
          color: '#ffffff',
        },
        top: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.hourly.map((item) => item.time),
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)',
          },
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 11,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Satış (₺)',
          position: 'left',
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)',
            },
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 11,
            formatter: (value) => `${value.toLocaleString('tr-TR')}₺`,
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
              type: 'dashed',
            },
          },
        },
        {
          type: 'value',
          name: 'Sipariş',
          position: 'right',
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)',
            },
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 11,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: 'Satış',
          type: 'line',
          yAxisIndex: 0,
          data: data.hourly.map((item) => item.sales),
          smooth: true,
          lineStyle: {
            color: '#3b82f6',
            width: 3,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0)' },
              ],
            },
          },
          symbolSize: 6,
          symbol: 'circle',
          animation: true,
          animationDuration: 2000,
          animationEasing: 'cubicOut',
        },
        {
          name: 'Sipariş Sayısı',
          type: 'bar',
          yAxisIndex: 1,
          data: data.hourly.map((item) => item.orders),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#f59e0b' },
                { offset: 1, color: 'rgba(245, 158, 11, 0.6)' },
              ],
            },
            borderRadius: [2, 2, 0, 0],
          },
          barWidth: '60%',
          animation: true,
          animationDuration: 1500,
          animationDelay: (idx) => idx * 50,
        },
      ],
    }
  }, [data])
  if (loading) {
    return _jsxs('div', {
      className: 'glass-card rounded-xl p-6',
      children: [
        _jsxs('div', {
          className: 'mb-4 flex items-center justify-between',
          children: [
            _jsx(Skeleton, { className: 'h-6 w-32' }),
            _jsx(Skeleton, { className: 'h-4 w-16' }),
          ],
        }),
        _jsx(Skeleton, { className: 'h-64 w-full' }),
      ],
    })
  }
  return _jsxs(motion.div, {
    className:
      'glass-card rounded-xl p-6 transition-all duration-300 hover:border-white/20',
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
    children: [
      _jsxs('div', {
        className: 'mb-4 flex items-center justify-between',
        children: [
          _jsx('h3', {
            className: 'text-lg font-semibold text-white',
            children: 'Saatlik Sat\u0131\u015F Analizi',
          }),
          _jsx('span', {
            className:
              'rounded-full bg-white/10 px-2 py-1 text-xs text-white/60',
            children: 'Son 24 Saat',
          }),
        ],
      }),
      chartOption
        ? _jsx(ReactECharts, {
            option: chartOption,
            style: { height: '300px', width: '100%' },
            opts: { renderer: 'svg' },
            notMerge: true,
            lazyUpdate: true,
          })
        : _jsx('div', {
            className: 'flex h-64 items-center justify-center text-white/60',
            children: 'Veri y\u00FCkleniyor...',
          }),
    ],
  })
}
