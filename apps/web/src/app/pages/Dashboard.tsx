import React, { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Title, EmptyState, SkeletonCard } from '../../components/ui'
import { KpiCard } from '../../components/kpi/KpiCard'
import { SalesChart } from '../../components/charts/SalesChart'
import { BusyHoursChart } from '../../components/charts/BusyHoursChart'
import { DateRangePicker } from '../../components/filters/DateRangePicker'
import { useOrgStore } from '../../store/orgStore'
import { t } from '../../lib/i18n'
import { formatCurrency, formatNumber } from '../../lib/format'
import api from '../../lib/api'

interface OverviewData {
  kpis: {
    revenue: number
    orders: number
    aov: number
    visitors?: number
  }
  sales: Array<{
    ts: string
    revenue: number
    orders: number
  }>
  busyHours?: Array<{
    hour: number
    visitors: number
  }>
}

export const Dashboard: React.FC = () => {
  const { selectedStoreId } = useOrgStore()
  const [dateRange, setDateRange] = useState<{
    from: string
    to: string
  } | null>(null)

  const fetchOverview = useCallback(async (): Promise<OverviewData> => {
    if (!selectedStoreId || !dateRange) {
      throw new Error('Store ID and date range are required')
    }

    const response = await api.get('/metrics/overview', {
      params: {
        storeId: selectedStoreId,
        from: dateRange.from,
        to: dateRange.to,
      },
    })
    return response.data
  }, [selectedStoreId, dateRange])

  const {
    data: overview,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['metrics', 'overview', selectedStoreId, dateRange],
    queryFn: fetchOverview,
    enabled: !!(selectedStoreId && dateRange),
    onError: () => {
      toast.error(t('common.error'))
    },
  })

  const handleDateRangeChange = useCallback(
    (range: { from: string; to: string }) => {
      setDateRange(range)
    },
    []
  )

  if (!selectedStoreId) {
    return (
      <div className="p-6">
        <Title level={1} className="mb-6">
          Dashboard
        </Title>
        <EmptyState
          title={t('dashboard.empty')}
          description="Please select a store to view dashboard data."
          icon={
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
        />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <Title level={1}>Dashboard</Title>
        <DateRangePicker onRangeChange={handleDateRangeChange} />
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <KpiCard
              label={t('dashboard.kpiRevenue')}
              value={
                overview?.kpis?.revenue
                  ? formatCurrency(overview.kpis.revenue)
                  : '₺0.00'
              }
            />
            <KpiCard
              label={t('dashboard.kpiOrders')}
              value={
                overview?.kpis?.orders
                  ? formatNumber(overview.kpis.orders)
                  : '0'
              }
            />
            <KpiCard
              label={t('dashboard.kpiAOV')}
              value={
                overview?.kpis?.aov
                  ? formatCurrency(overview.kpis.aov)
                  : '₺0.00'
              }
            />
            {overview?.kpis?.visitors !== undefined && (
              <KpiCard
                label={t('dashboard.kpiVisitors')}
                value={formatNumber(overview.kpis.visitors)}
              />
            )}
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SalesChart data={overview?.sales || []} loading={isLoading} />
        {overview?.busyHours && (
          <BusyHoursChart data={overview.busyHours} loading={isLoading} />
        )}
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">{t('common.error')}</p>
        </div>
      )}
    </div>
  )
}
