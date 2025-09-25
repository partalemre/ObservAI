import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'

// Simple brand token
const brand = {
  from: '#0ea5e9', // sky-500
  to: '#22d3ee', // cyan-400
}

const FadeUp: React.FC<{ delay?: number; children: React.ReactNode }> = ({
  delay = 0,
  children,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.6, ease: 'easeOut', delay }}
  >
    {children}
  </motion.div>
)

export default function Home() {
  const { scrollYProgress } = useScroll()
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.8, 0.3])

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* animated gradient canvas */}
      <motion.div
        aria-hidden
        style={{ opacity: bgOpacity }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -inset-[20%] bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.35),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.35),transparent_55%)] blur-2xl" />
      </motion.div>

      {/* hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-28 pb-24 md:grid-cols-2">
        <FadeUp>
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
              Built for modern hospitality
            </div>
            <h1 className="text-4xl leading-tight font-extrabold md:text-6xl">
              Operate smarter with
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                ObservAI
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-white/70">
              Unify POS, menu, kitchen, inventory and AI insights in one place.
              Clarity, control and margin—on every shift.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 hover:opacity-95"
              >
                Request a demo →
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white/90 hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          {/* glass KPI deck */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { k: 'Average Daily Sales', v: '$3,495', s: '+3.7%' },
              { k: 'CoGS', v: '31.4%', s: '-4.5%' },
              { k: 'Labor Ratio', v: '25.2%', s: '+1.0%' },
              { k: 'Occupancy', v: '8.2%', s: '+0.3%' },
            ].map((x, i) => (
              <motion.div
                key={x.k}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md"
              >
                <div className="text-xs text-white/60">{x.k}</div>
                <div className="mt-2 text-2xl font-bold">{x.v}</div>
                <div className="mt-1 text-xs text-emerald-300">{x.s}</div>
              </motion.div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* modules */}
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <FadeUp>
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-white/90 md:text-3xl">
            Everything connected
          </h2>
        </FadeUp>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              t: 'POS',
              d: 'Fast, keyboard-friendly checkout with cash drawer control',
              to: '/pos',
            },
            {
              t: 'Kitchen',
              d: 'Prioritized tickets, expo view and bump bar',
              to: '/kitchen',
            },
            {
              t: 'Menu',
              d: 'Smart modifiers and pricing; bulk updates in seconds',
              to: '/menu',
            },
            {
              t: 'Inventory',
              d: 'Par levels, variance and vendor price watch',
              to: '/inventory',
            },
            {
              t: 'Alerts',
              d: 'Thresholds & escalations to keep shifts on track',
              to: '/alerts',
            },
            {
              t: 'Settings',
              d: 'Org, stores, taxes and roles',
              to: '/settings',
            },
          ].map((m, i) => (
            <FadeUp key={m.t} delay={0.05 * i}>
              <Link
                to={m.to}
                className="group block rounded-2xl border border-white/10 bg-white/[0.04] p-5 ring-0 transition hover:bg-white/[0.07]"
              >
                <div className="mb-1 text-sm text-white/60">Module</div>
                <div className="text-lg font-semibold">{m.t}</div>
                <p className="mt-2 text-sm text-white/65">{m.d}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-cyan-300 opacity-0 transition group-hover:opacity-100">
                  Open {m.t} <span>→</span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="mx-auto max-w-7xl px-6 pb-10 text-sm text-white/50">
        © {new Date().getFullYear()} ObservAI
      </footer>
    </div>
  )
}
