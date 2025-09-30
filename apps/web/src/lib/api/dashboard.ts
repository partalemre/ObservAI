// Mock API function for dashboard metrics
export interface DashboardMetrics {
  revenue: number
  visitors: number
  avgTicket: number
  occupancy: number
  revenueChart: number[]
  visitorsChart: number[]
  salesData: {
    hourly: Array<{
      time: string
      sales: number
      orders: number
    }>
    daily: Array<{
      date: string
      revenue: number
      orders: number
    }>
  }
  heatmapData: Array<{
    x: number
    y: number
    intensity: number
    area: string
  }>
}

// Simulate real-time data with some randomness
const generateRandomData = (base: number, variance: number = 0.1): number => {
  return Math.round(base + (Math.random() - 0.5) * variance * base)
}

const generateChartData = (length: number, base: number): number[] => {
  return Array.from({ length }, (_, i) => {
    const trend = Math.sin((i / length) * Math.PI * 2) * 0.3
    const noise = (Math.random() - 0.5) * 0.4
    return Math.max(0, Math.round(base * (1 + trend + noise)))
  })
}

const generateHourlyData = () => {
  const hours = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hour = time.getHours()

    // Simulate busy periods (lunch: 12-14, dinner: 18-21)
    let baseSales = 150
    if (hour >= 12 && hour <= 14) baseSales = 300
    if (hour >= 18 && hour <= 21) baseSales = 400
    if (hour >= 22 || hour <= 6) baseSales = 50

    hours.push({
      time: time.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      sales: generateRandomData(baseSales, 0.2),
      orders: generateRandomData(Math.floor(baseSales / 35), 0.25),
    })
  }

  return hours
}

const generateDailyData = () => {
  const days = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dayOfWeek = date.getDay()

    // Weekend vs weekday patterns
    let baseRevenue = 8500
    if (dayOfWeek === 0 || dayOfWeek === 6) baseRevenue = 12000 // Weekend

    days.push({
      date: date.toLocaleDateString('tr-TR'),
      revenue: generateRandomData(baseRevenue, 0.15),
      orders: generateRandomData(Math.floor(baseRevenue / 45), 0.2),
    })
  }

  return days
}

const generateHeatmapData = () => {
  const areas = [
    'Giriş',
    'Kasa',
    'Masa 1-5',
    'Masa 6-10',
    'Bar',
    'Mutfak Girişi',
    'Tuvalet',
    'Bahçe',
    'VIP Alan',
  ]

  return areas.map((area, index) => ({
    x: (index % 3) * 100 + 50,
    y: Math.floor(index / 3) * 80 + 40,
    intensity: Math.random() * 100,
    area,
  }))
}

export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300))

  // Base values that change slightly each time to simulate real-time updates
  const baseRevenue = 24850
  const baseVisitors = 1247
  const baseTicket = 89.5
  const baseOccupancy = 68.5

  return {
    revenue: generateRandomData(baseRevenue, 0.02),
    visitors: generateRandomData(baseVisitors, 0.05),
    avgTicket: generateRandomData(baseTicket, 0.03),
    occupancy: Math.min(
      100,
      Math.max(0, generateRandomData(baseOccupancy, 0.1))
    ),
    revenueChart: generateChartData(24, 1200), // Last 24 hours
    visitorsChart: generateChartData(24, 50), // Last 24 hours
    salesData: {
      hourly: generateHourlyData(),
      daily: generateDailyData(),
    },
    heatmapData: generateHeatmapData(),
  }
}

// Mock functions for other dashboard components
export const fetchTopProducts = async () => {
  await new Promise((resolve) => setTimeout(resolve, 150))

  return [
    { id: 1, name: 'Cappuccino', quantity: 156, revenue: 780 },
    { id: 2, name: 'Türk Kahvesi', quantity: 142, revenue: 568 },
    { id: 3, name: 'Cheesecake', quantity: 89, revenue: 712 },
    { id: 4, name: 'Americano', quantity: 78, revenue: 390 },
    { id: 5, name: 'Croissant', quantity: 67, revenue: 268 },
  ].map((item) => ({
    ...item,
    quantity: generateRandomData(item.quantity, 0.1),
    revenue: generateRandomData(item.revenue, 0.08),
  }))
}

export const fetchStaffPerformance = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return [
    { id: 1, name: 'Ayşe K.', orders: 89, revenue: 4250, rating: 4.8 },
    { id: 2, name: 'Mehmet A.', orders: 76, revenue: 3650, rating: 4.6 },
    { id: 3, name: 'Zehra S.', orders: 65, revenue: 3100, rating: 4.9 },
    { id: 4, name: 'Can D.', orders: 58, revenue: 2980, rating: 4.4 },
  ].map((staff) => ({
    ...staff,
    orders: generateRandomData(staff.orders, 0.05),
    revenue: generateRandomData(staff.revenue, 0.06),
    rating: Math.min(
      5,
      Math.max(4, staff.rating + (Math.random() - 0.5) * 0.2)
    ),
  }))
}

export const fetchAlerts = async () => {
  await new Promise((resolve) => setTimeout(resolve, 80))

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Kahve stoku düşük (2 kg kaldı)',
      time: '5 dk önce',
    },
    {
      id: 2,
      type: 'info',
      message: 'Yeni müşteri rezervasyonu',
      time: '12 dk önce',
    },
    {
      id: 3,
      type: 'error',
      message: 'POS cihazı bağlantı hatası',
      time: '18 dk önce',
    },
    {
      id: 4,
      type: 'success',
      message: 'Günlük hedef %120 tamamlandı',
      time: '1 saat önce',
    },
  ]

  // Randomly shuffle and return 2-4 alerts
  return alerts
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 2)
}
