import type { CameraMetricsDTO, MenuItemDTO } from '@observai/types'

const cameraMetricsMock: CameraMetricsDTO = {
  ts: new Date().toISOString(),
  peopleIn: 120,
  peopleOut: 100,
  current: 20,
  ageBuckets: {
    '0-17': 2,
    '18-25': 8,
    '26-35': 5,
    '36-50': 3,
    '50+': 2,
  },
  gender: { male: 11, female: 9, unknown: 0 },
}

const menuMock: MenuItemDTO[] = [
  {
    id: '1',
    name_tr: 'Çay',
    name_en: 'Tea',
    price: 15,
    category: 'Sıcak İçecek',
    inStock: true,
  },
  {
    id: '2',
    name_tr: 'Latte',
    name_en: 'Latte',
    price: 75,
    category: 'Kahve',
    inStock: true,
  },
  {
    id: '3',
    name_tr: 'Simit',
    name_en: 'Bagel',
    price: 40,
    category: 'Fırın',
    inStock: false,
  },
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value)

export default function DashboardPage() {
  return (
    <main className="layout">
      <header className="page-header">
        <span className="page-header__label">ObservAI</span>
        <h1 className="page-header__title">Cafe Operasyon Panosu</h1>
        <p className="page-header__description">
          API ve kamera servisleri bağlandığında gerçek veriler burada akacak.
          Şimdilik sahte verilerle görsel taslak hazır; entegrasyon sonrası bu
          grafikler canlı güncellenecek.
        </p>
      </header>

      <section className="kpi-grid">
        <KpiCard
          title="Anlık Misafir"
          value={cameraMetricsMock.current}
          helper={`Toplam giriş: ${cameraMetricsMock.peopleIn}`}
        />
        <KpiCard
          title="Günlük Sipariş"
          value={86}
          helper="POS entegrasyonu ile sunulacak"
        />
        <KpiCard title="Aktif Kampanya" value={3} helper="CRM modülü" />
        <KpiCard title="Kritik Stok" value={5} helper="Envanter servisi" />
      </section>

      <div className="panels-grid">
        <section className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Menü</h2>
            <span className="panel__meta">POS Senkronu Bekleniyor</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Kategori</th>
                <th style={{ textAlign: 'right' }}>Fiyat</th>
                <th style={{ textAlign: 'right' }}>Stok</th>
              </tr>
            </thead>
            <tbody>
              {menuMock.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="table__title">{item.name_tr}</div>
                    <div className="table__subtitle">{item.name_en}</div>
                  </td>
                  <td>{item.category}</td>
                  <td style={{ textAlign: 'right' }}>
                    {formatCurrency(item.price)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span
                      className={`badge ${
                        item.inStock ? 'badge--success' : 'badge--danger'
                      }`}
                    >
                      {item.inStock ? 'Stokta' : 'Kritik'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Kamera Ölçümleri</h2>
            <span className="panel__meta">
              {new Date(cameraMetricsMock.ts).toLocaleTimeString('tr-TR')}
            </span>
          </div>

          <dl className="metrics-list">
            <div className="metrics-row">
              <dt className="metrics-row__label">Giren / Çıkan</dt>
              <dd>
                {cameraMetricsMock.peopleIn} / {cameraMetricsMock.peopleOut}
              </dd>
            </div>
            <div className="metrics-row">
              <dt className="metrics-row__label">Yaş Dağılımı</dt>
              <dd>
                {Object.entries(cameraMetricsMock.ageBuckets)
                  .map(([bucket, value]) => `${bucket}: ${value}`)
                  .join('  ·  ')}
              </dd>
            </div>
            <div className="metrics-row">
              <dt className="metrics-row__label">Cinsiyet</dt>
              <dd>
                Erkek {cameraMetricsMock.gender.male} · Kadın{' '}
                {cameraMetricsMock.gender.female} · Belirsiz{' '}
                {cameraMetricsMock.gender.unknown}
              </dd>
            </div>
          </dl>

          <p className="metrics-footnote">
            Gerçek veriler FastAPI servisi üzerinden WebSocket ile iletilecek.
            NestJS gateway modülü eklendiğinde bu panel anlık olarak
            güncellenecek.
          </p>
        </section>
      </div>
    </main>
  )
}

function KpiCard({
  title,
  value,
  helper,
}: {
  title: string
  value: number
  helper?: string
}) {
  return (
    <article className="kpi-card">
      <p className="kpi-card__label">{title}</p>
      <p className="kpi-card__value">{value}</p>
      {helper ? <p className="kpi-card__helper">{helper}</p> : null}
    </article>
  )
}
