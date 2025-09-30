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
    className: 'space-y-6 p-6 min-h-screen bg-dark-900',
    variants: containerVariants,
    initial: 'hidden',
    animate: 'visible',
    children: [
      _jsxs(motion.div, {
        className:
          'flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4',
        variants: itemVariants,
        children: [
          _jsxs('div', {
            className: 'flex items-center gap-3',
            children: [
              _jsx('div', {
                className:
                  'w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center',
                children: _jsx(Camera, {
                  className: 'w-6 h-6 text-primary-400',
                }),
              }),
              _jsxs('div', {
                children: [
                  _jsx('h1', {
                    className: 'text-3xl font-bold text-white font-display',
                    children: 'Kamera Analiti\u011Fi',
                  }),
                  _jsx('p', {
                    className: 'text-white/70 mt-1',
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
                    'glass-button px-3 py-2 rounded-lg text-sm flex items-center gap-2 text-red-400 hover:text-red-300',
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  children: [
                    _jsx(RefreshCw, {
                      className: `w-4 h-4 ${reconnecting ? 'animate-spin' : ''}`,
                    }),
                    'Yeniden Ba\u011Flan',
                  ],
                }),
              _jsx('div', {
                className:
                  'flex items-center gap-2 glass-card px-3 py-2 rounded-lg',
                children: connected
                  ? _jsxs(_Fragment, {
                      children: [
                        _jsx(Wifi, { className: 'w-4 h-4 text-green-400' }),
                        _jsx('span', {
                          className: 'text-sm text-green-400',
                          children: 'Ba\u011Fl\u0131',
                        }),
                      ],
                    })
                  : _jsxs(_Fragment, {
                      children: [
                        _jsx(WifiOff, { className: 'w-4 h-4 text-red-400' }),
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
          'glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4',
        variants: itemVariants,
        children: [
          _jsxs('div', {
            className: 'flex items-center gap-8',
            children: [
              _jsxs('div', {
                className: 'flex items-center gap-2',
                children: [
                  _jsx(motion.div, {
                    className: 'w-3 h-3 rounded-full bg-green-500',
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
                  _jsx(Users, { className: 'w-5 h-5 text-primary-400' }),
                  _jsxs('div', {
                    className: 'text-white',
                    children: [
                      _jsx('span', {
                        className: 'text-2xl font-bold text-primary-300',
                        children: liveData?.current || 0,
                      }),
                      _jsx('span', {
                        className: 'text-sm text-white/70 ml-2',
                        children: 'ki\u015Fi i\u00E7eride',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          _jsxs('div', {
            className: 'flex gap-6 flex-wrap',
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
                  _jsx(Clock, { className: 'w-3 h-3' }),
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
        className: 'grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6',
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
            'glass-card rounded-xl p-6 border-red-500/20 bg-red-500/10',
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          children: _jsxs('div', {
            className: 'text-center',
            children: [
              _jsx(WifiOff, {
                className: 'w-12 h-12 text-red-400 mx-auto mb-4',
              }),
              _jsx('h3', {
                className: 'text-lg font-semibold text-white mb-2',
                children: 'Kamera Ba\u011Flant\u0131s\u0131 Kesildi',
              }),
              _jsx('p', {
                className: 'text-white/70 mb-4',
                children:
                  'L\u00FCtfen kamera sistemi ba\u011Flant\u0131s\u0131n\u0131 kontrol edin',
              }),
              _jsx('button', {
                onClick: reconnect,
                className:
                  'glass-button px-4 py-2 rounded-lg text-primary-400 hover:text-primary-300 transition-colors',
                disabled: reconnecting,
                children: reconnecting
                  ? _jsxs(_Fragment, {
                      children: [
                        _jsx(RefreshCw, {
                          className: 'w-4 h-4 inline mr-2 animate-spin',
                        }),
                        'Ba\u011Flan\u0131yor...',
                      ],
                    })
                  : _jsxs(_Fragment, {
                      children: [
                        _jsx(RefreshCw, { className: 'w-4 h-4 inline mr-2' }),
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
