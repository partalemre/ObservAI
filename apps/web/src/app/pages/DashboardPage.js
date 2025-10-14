import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
/**
 * Dashboard Page - Modern analytics dashboard with all panels
 */
import { useEffect } from 'react'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { LiveKpiPanel } from '../../components/panels/LiveKpiPanel'
import { DemographicsPanel } from '../../components/panels/DemographicsPanel'
import { DonutChart } from '../../components/charts/DonutChart'
import { GroupedBarChart } from '../../components/charts/GroupedBarChart'
import { TimelineChart } from '../../components/charts/TimelineChart'
import { HistogramChart } from '../../components/charts/HistogramChart'
import { GaugeChart } from '../../components/charts/GaugeChart'
import { GlassCard } from '../../components/ui/GlassCard'
import { genderColor } from '../../config/theme'
import { ToastContainer } from '../../components/panels/ToastContainer'
export const DashboardPage = () => {
  const { globalData, history, initConnection, disconnect } =
    useAnalyticsStore()
  // Initialize WebSocket connection
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:5000'
    initConnection(wsUrl)
    return () => {
      disconnect()
    }
  }, [initConnection, disconnect])
  // Prepare chart data
  const genderDonutData = globalData
    ? [
        {
          name: 'Male',
          value: globalData.demographics.gender.male,
          color: genderColor('male'),
        },
        {
          name: 'Female',
          value: globalData.demographics.gender.female,
          color: genderColor('female'),
        },
        {
          name: 'Unknown',
          value: globalData.demographics.gender.unknown,
          color: genderColor('unknown'),
        },
      ]
    : []
  const ageBarData = globalData
    ? {
        categories: ['Child', 'Young', 'Adult', 'Mature', 'Senior'],
        series: [
          {
            name: 'Count',
            data: [
              globalData.demographics.ages.child,
              globalData.demographics.ages.young,
              globalData.demographics.ages.adult,
              globalData.demographics.ages.mature,
              globalData.demographics.ages.senior,
            ],
          },
        ],
      }
    : { categories: [], series: [] }
  const timelineData = history.slice(-60).map((h, idx) => ({
    timestamp: new Date(h.timestamp).toLocaleTimeString(),
    current: h.current,
    queue: h.queue,
  }))
  const dwellHistogramData = [
    { label: '0-1m', value: Math.floor(Math.random() * 20) },
    { label: '1-2m', value: Math.floor(Math.random() * 30) },
    { label: '2-5m', value: Math.floor(Math.random() * 40) },
    { label: '5-10m', value: Math.floor(Math.random() * 25) },
    { label: '10m+', value: Math.floor(Math.random() * 15) },
  ]
  return _jsxs('div', {
    className: 'min-h-screen bg-[#0b0b10] p-6',
    children: [
      _jsxs('div', {
        className: 'mx-auto max-w-[1800px]',
        children: [
          _jsxs('div', {
            className: 'mb-8',
            children: [
              _jsx('h1', {
                className: 'text-3xl font-bold text-white',
                children: 'Analytics Dashboard',
              }),
              _jsx('p', {
                className: 'mt-2 text-sm text-gray-400',
                children:
                  'Real-time customer analytics powered by AI computer vision',
              }),
            ],
          }),
          _jsxs('div', {
            className: 'mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3',
            children: [
              _jsx(LiveKpiPanel, {}),
              _jsxs(GlassCard, {
                className: 'p-6',
                children: [
                  _jsx('h3', {
                    className: 'mb-4 text-lg font-semibold text-white',
                    children: 'Occupancy Gauge',
                  }),
                  _jsx(GaugeChart, {
                    value: globalData?.current ?? 0,
                    max: 50,
                    title: 'Current Visitors',
                  }),
                ],
              }),
              _jsxs(GlassCard, {
                className: 'p-6',
                children: [
                  _jsx('h3', {
                    className: 'mb-4 text-lg font-semibold text-white',
                    children: 'Queue Status',
                  }),
                  _jsx(GaugeChart, {
                    value: globalData?.queue ?? 0,
                    max: 20,
                    title: 'Queue Length',
                  }),
                ],
              }),
            ],
          }),
          _jsxs('div', {
            className: 'mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2',
            children: [
              _jsx(DemographicsPanel, {}),
              _jsxs(GlassCard, {
                className: 'p-6',
                children: [
                  _jsx('h3', {
                    className: 'mb-4 text-lg font-semibold text-white',
                    children: 'Gender Distribution',
                  }),
                  _jsx(DonutChart, { data: genderDonutData, height: 280 }),
                ],
              }),
            ],
          }),
          _jsxs('div', {
            className: 'grid grid-cols-1 gap-6 lg:grid-cols-2',
            children: [
              _jsxs(GlassCard, {
                className: 'p-6',
                children: [
                  _jsx('h3', {
                    className: 'mb-4 text-lg font-semibold text-white',
                    children: 'Traffic Timeline (Last 60 samples)',
                  }),
                  _jsx(TimelineChart, {
                    timestamps: timelineData.map((d) => d.timestamp),
                    series: [
                      {
                        name: 'Current',
                        data: timelineData.map((d) => d.current),
                        yAxisIndex: 0,
                        color: '#4FC3F7',
                      },
                      {
                        name: 'Queue',
                        data: timelineData.map((d) => d.queue),
                        yAxisIndex: 1,
                        color: '#FFB74D',
                      },
                    ],
                    height: 320,
                  }),
                ],
              }),
              _jsxs(GlassCard, {
                className: 'p-6',
                children: [
                  _jsx('h3', {
                    className: 'mb-4 text-lg font-semibold text-white',
                    children: 'Dwell Time Distribution',
                  }),
                  _jsx(HistogramChart, {
                    bins: dwellHistogramData,
                    percentiles: { p50: 2, p90: 4 },
                    height: 320,
                  }),
                ],
              }),
            ],
          }),
          _jsx('div', {
            className: 'mt-6',
            children: _jsxs(GlassCard, {
              className: 'p-6',
              children: [
                _jsx('h3', {
                  className: 'mb-4 text-lg font-semibold text-white',
                  children: 'Age Group Breakdown',
                }),
                _jsx(GroupedBarChart, {
                  categories: ageBarData.categories,
                  series: ageBarData.series,
                  height: 280,
                }),
              ],
            }),
          }),
        ],
      }),
      _jsx(ToastContainer, {}),
    ],
  })
}
