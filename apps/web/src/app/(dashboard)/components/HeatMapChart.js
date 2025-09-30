import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import { Skeleton } from '../../../components/ui'
export const HeatMapChart = ({ data, loading }) => {
  const chartOption = useMemo(() => {
    if (!data) return null
    // Convert data to ECharts format
    const heatmapData = data.map((item) => [item.x, item.y, item.intensity])
    const maxIntensity = Math.max(...data.map((item) => item.intensity))
    return {
      title: {
        text: '',
        left: 'center',
        textStyle: {
          color: '#ffffff',
          fontSize: 16,
        },
      },
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(26, 24, 37, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textStyle: {
          color: '#ffffff',
        },
        formatter: (params) => {
          const dataIndex = params.dataIndex
          const item = data[dataIndex]
          return `
            <div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${item.area}</div>
              <div style="color: #3b82f6;">Yoğunluk: ${item.intensity.toFixed(1)}%</div>
            </div>
          `
        },
      },
      grid: {
        height: '70%',
        top: '10%',
        left: '10%',
        right: '10%',
        bottom: '15%',
      },
      xAxis: {
        type: 'value',
        show: false,
        min: 0,
        max: 300,
      },
      yAxis: {
        type: 'value',
        show: false,
        min: 0,
        max: 250,
      },
      visualMap: {
        min: 0,
        max: maxIntensity,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
        textStyle: {
          color: '#ffffff',
        },
        inRange: {
          color: [
            'rgba(59, 130, 246, 0.1)',
            'rgba(59, 130, 246, 0.3)',
            'rgba(59, 130, 246, 0.6)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(59, 130, 246, 1)',
          ],
        },
      },
      series: [
        {
          name: 'Müşteri Yoğunluğu',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            formatter: (params) => {
              const item = data[params.dataIndex]
              return item.area
            },
            color: '#ffffff',
            fontSize: 10,
            fontWeight: 'bold',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(59, 130, 246, 0.8)',
            },
          },
          animation: true,
          animationDuration: 2000,
          animationEasing: 'cubicOut',
        },
        // Add scatter points for better visibility
        {
          name: 'Alanlar',
          type: 'scatter',
          data: data.map((item) => [item.x, item.y, item.intensity]),
          symbolSize: (value) => Math.max(15, (value[2] / maxIntensity) * 30),
          itemStyle: {
            color: 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: 1,
          },
          emphasis: {
            scale: 1.2,
            itemStyle: {
              borderColor: '#3b82f6',
              borderWidth: 2,
            },
          },
        },
      ],
    }
  }, [data])
  if (loading) {
    return _jsxs('div', {
      className: 'glass-card rounded-xl p-6',
      children: [
        _jsxs('div', {
          className: 'flex items-center justify-between mb-4',
          children: [
            _jsx(Skeleton, { className: 'h-6 w-40' }),
            _jsx(Skeleton, { className: 'h-4 w-20' }),
          ],
        }),
        _jsx(Skeleton, { className: 'h-64 w-full' }),
      ],
    })
  }
  return _jsxs(motion.div, {
    className:
      'glass-card rounded-xl p-6 hover:border-white/20 transition-all duration-300',
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.2 },
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between mb-4',
        children: [
          _jsx('h3', {
            className: 'text-lg font-semibold text-white',
            children: 'M\u00FC\u015Fteri Yo\u011Funluk Haritas\u0131',
          }),
          _jsx('span', {
            className:
              'text-xs text-white/60 px-2 py-1 bg-white/10 rounded-full',
            children: 'Anl\u0131k',
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
            className: 'h-64 flex items-center justify-center text-white/60',
            children: _jsxs('div', {
              className: 'text-center',
              children: [
                _jsx('div', {
                  className:
                    'w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center',
                  children: _jsx('span', {
                    className: 'text-2xl',
                    children: '\uD83D\uDCCD',
                  }),
                }),
                _jsx('p', {
                  children: 'Yo\u011Funluk verisi y\u00FCkleniyor...',
                }),
              ],
            }),
          }),
    ],
  })
}
