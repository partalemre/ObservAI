/**
 * Dashboard Page - Modern analytics dashboard with all panels
 */

import React, { useEffect } from 'react'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { LiveKpiPanel } from '../../components/panels/LiveKpiPanel'
import { DemographicsPanel } from '../../components/panels/DemographicsPanel'
import { DonutChart } from '../../components/charts/DonutChart'
import { GroupedBarChart } from '../../components/charts/GroupedBarChart'
import { TimelineChart } from '../../components/charts/TimelineChart'
import { HistogramChart } from '../../components/charts/HistogramChart'
import { GaugeChart } from '../../components/charts/GaugeChart'
import { GlassCard } from '../../components/ui/GlassCard'
import { genderColor, ageBucketColor } from '../../config/theme'
import { ToastContainer } from '../../components/panels/ToastContainer'

export const DashboardPage: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-[#0b0b10] p-6">
      <div className="mx-auto max-w-[1800px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="mt-2 text-sm text-gray-400">
            Real-time customer analytics powered by AI computer vision
          </p>
        </div>

        {/* Top Row - KPIs */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <LiveKpiPanel />

          <GlassCard className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Occupancy Gauge
            </h3>
            <GaugeChart
              value={globalData?.current ?? 0}
              max={50}
              title="Current Visitors"
            />
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Queue Status
            </h3>
            <GaugeChart
              value={globalData?.queue ?? 0}
              max={20}
              title="Queue Length"
            />
          </GlassCard>
        </div>

        {/* Middle Row - Demographics */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DemographicsPanel />

          <GlassCard className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Gender Distribution
            </h3>
            <DonutChart data={genderDonutData} height={280} />
          </GlassCard>
        </div>

        {/* Bottom Row - Timeline & Analytics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GlassCard className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Traffic Timeline (Last 60 samples)
            </h3>
            <TimelineChart
              timestamps={timelineData.map((d) => d.timestamp)}
              series={[
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
              ]}
              height={320}
            />
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Dwell Time Distribution
            </h3>
            <HistogramChart
              bins={dwellHistogramData}
              percentiles={{ p50: 2, p90: 4 }}
              height={320}
            />
          </GlassCard>
        </div>

        {/* Age Distribution Bar Chart */}
        <div className="mt-6">
          <GlassCard className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Age Group Breakdown
            </h3>
            <GroupedBarChart
              categories={ageBarData.categories}
              series={ageBarData.series}
              height={280}
            />
          </GlassCard>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  )
}
