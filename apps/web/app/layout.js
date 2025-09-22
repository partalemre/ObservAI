import './globals.css'
export const metadata = {
  title: 'ObservAI',
  description: 'Gerçek zamanlı kafe analitiği ve operasyon takibi',
}
export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
