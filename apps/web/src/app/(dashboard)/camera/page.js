import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from 'react/jsx-runtime'
import { motion } from 'framer-motion'
import { useCameraWebSocket } from '../../../hooks/useCameraWebSocket'
import { Stat } from './components/Stat'
import { HeatMapVisualization } from './components/HeatMapVisualization'
import { GenderDistribution } from './components/GenderDistribution'
import { AgeDistribution } from './components/AgeDistribution'
import { TrafficTimeline } from './components/TrafficTimeline'
import { Camera, Wifi, WifiOff, RefreshCw, Users, Clock } from 'lucide-react'
const CameraAnalytics = () => {
  const {
    data: liveData,
    connected,
    error,
    reconnecting,
    reconnect,
  } = useCameraWebSocket()
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }
  return _jsxs(motion.div, {
    className: 'bg-dark-900 min-h-screen space-y-6 p-6',
    variants: containerVariants,
    initial: 'hidden',
    animate: 'visible',
    children: [
      _jsxs(motion.div, {
        className:
          'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        variants: itemVariants,
        children: [
          _jsxs('div', {
            className: 'flex items-center gap-3',
            children: [
              _jsx('div', {
                className:
                  'bg-primary-500/20 flex h-12 w-12 items-center justify-center rounded-xl',
                children: _jsx(Camera, {
                  className: 'text-primary-400 h-6 w-6',
                }),
              }),
              _jsxs('div', {
                children: [
                  _jsx('h1', {
                    className: 'font-display text-3xl font-bold text-white',
                    children: 'Kamera Analiti\u011Fi',
                  }),
                  _jsx('p', {
                    className: 'mt-1 text-white/70',
                    children:
                      'Ger\u00E7ek zamanl\u0131 m\u00FC\u015Fteri davran\u0131\u015F analizi',
                  }),
                ],
              }),
            ],
          }),
          _jsxs('div', {
            className: 'flex items-center gap-3',
            children: [
              error &&
                _jsxs(motion.button, {
                  onClick: reconnect,
                  className:
                    'glass-button flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:text-red-300',
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  children: [
                    _jsx(RefreshCw, {
                      className: `h-4 w-4 ${reconnecting ? 'animate-spin' : ''}`,
                    }),
                    'Yeniden Ba\u011Flan',
                  ],
                }),
              _jsx('div', {
                className:
                  'glass-card flex items-center gap-2 rounded-lg px-3 py-2',
                children: connected
                  ? _jsxs(_Fragment, {
                      children: [
                        _jsx(Wifi, { className: 'h-4 w-4 text-green-400' }),
                        _jsx('span', {
                          className: 'text-sm text-green-400',
                          children: 'Ba\u011Fl\u0131',
                        }),
                      ],
                    })
                  : _jsxs(_Fragment, {
                      children: [
                        _jsx(WifiOff, { className: 'h-4 w-4 text-red-400' }),
                        _jsx('span', {
                          className: 'text-sm text-red-400',
                          children: reconnecting
                            ? 'Bağlanıyor...'
                            : 'Bağlantı Yok',
                        }),
                      ],
                    }),
              }),
            ],
          }),
        ],
      }),
      _jsxs(motion.div, {
        className:
          'glass-card flex flex-col justify-between gap-4 rounded-xl p-4 sm:flex-row sm:items-center',
        variants: itemVariants,
        children: [
          _jsxs('div', {
            className: 'flex items-center gap-8',
            children: [
              _jsxs('div', {
                className: 'flex items-center gap-2',
                children: [
                  _jsx(motion.div, {
                    className: 'h-3 w-3 rounded-full bg-green-500',
                    animate: { opacity: [1, 0.5, 1] },
                    transition: { repeat: Infinity, duration: 2 },
                  }),
                  _jsx('span', {
                    className: 'text-sm text-white/70',
                    children: 'Canl\u0131',
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'flex items-center gap-2',
                children: [
                  _jsx(Users, { className: 'text-primary-400 h-5 w-5' }),
                  _jsxs('div', {
                    className: 'text-white',
                    children: [
                      _jsx('span', {
                        className: 'text-primary-300 text-2xl font-bold',
                        children: liveData?.current || 0,
                      }),
                      _jsx('span', {
                        className: 'ml-2 text-sm text-white/70',
                        children: 'ki\u015Fi i\u00E7eride',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          _jsxs('div', {
            className: 'flex flex-wrap gap-6',
            children: [
              _jsx(Stat, {
                label: 'Giri\u015F',
                value: liveData?.entriesHour || 0,
                trend: 'up',
              }),
              _jsx(Stat, {
                label: '\u00C7\u0131k\u0131\u015F',
                value: liveData?.exitsHour || 0,
                trend: 'down',
              }),
              _jsx(Stat, {
                label: 'Ortalama S\u00FCre',
                value: `${liveData?.avgDuration || 0}dk`,
                isNumeric: false,
              }),
              _jsxs('div', {
                className: 'flex items-center gap-1 text-xs text-white/60',
                children: [
                  _jsx(Clock, { className: 'h-3 w-3' }),
                  liveData?.lastUpdate &&
                    _jsx('span', {
                      children: new Date(
                        liveData.lastUpdate
                      ).toLocaleTimeString('tr-TR'),
                    }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsxs(motion.div, {
        className: 'grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6',
        variants: itemVariants,
        children: [
          _jsx('div', {
            className: 'lg:col-span-2',
            children: _jsx(HeatMapVisualization, {
              data: liveData?.heatmap,
              floorPlan: '/cafe-layout.svg',
              loading: !connected,
            }),
          }),
          _jsxs('div', {
            className: 'space-y-4 lg:space-y-6',
            children: [
              _jsx(GenderDistribution, {
                data: liveData?.gender,
                loading: !connected,
              }),
              _jsx(AgeDistribution, {
                data: liveData?.age,
                loading: !connected,
              }),
            ],
          }),
        ],
      }),
      _jsx(motion.div, {
        variants: itemVariants,
        children: _jsx(TrafficTimeline, {
          data: liveData?.timeline,
          loading: !connected,
        }),
      }),
      error &&
        !connected &&
        _jsx(motion.div, {
          className:
            'glass-card rounded-xl border-red-500/20 bg-red-500/10 p-6',
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          children: _jsxs('div', {
            className: 'text-center',
            children: [
              _jsx(WifiOff, {
                className: 'mx-auto mb-4 h-12 w-12 text-red-400',
              }),
              _jsx('h3', {
                className: 'mb-2 text-lg font-semibold text-white',
                children: 'Kamera Ba\u011Flant\u0131s\u0131 Kesildi',
              }),
              _jsx('p', {
                className: 'mb-4 text-white/70',
                children:
                  'L\u00FCtfen kamera sistemi ba\u011Flant\u0131s\u0131n\u0131 kontrol edin',
              }),
              _jsx('button', {
                onClick: reconnect,
                className:
                  'glass-button text-primary-400 hover:text-primary-300 rounded-lg px-4 py-2 transition-colors',
                disabled: reconnecting,
                children: reconnecting
                  ? _jsxs(_Fragment, {
                      children: [
                        _jsx(RefreshCw, {
                          className: 'mr-2 inline h-4 w-4 animate-spin',
                        }),
                        'Ba\u011Flan\u0131yor...',
                      ],
                    })
                  : _jsxs(_Fragment, {
                      children: [
                        _jsx(RefreshCw, { className: 'mr-2 inline h-4 w-4' }),
                        'Tekrar Dene',
                      ],
                    }),
              }),
            ],
          }),
        }),
    ],
  })
}
export default CameraAnalytics
