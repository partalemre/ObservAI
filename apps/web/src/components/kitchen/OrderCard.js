import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { Clock, MapPin, StickyNote } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'
import { t } from '../../lib/i18n'
export const OrderCard = ({
  ticket,
  onStatusChange,
  density = 'comfortable',
  className,
}) => {
  const elapsedMinutes = Math.floor(
    (Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60)
  )
  // SLA coloring
  const getElapsedStyle = () => {
    if (elapsedMinutes < 5) return 'bg-gray-100 text-gray-700'
    if (elapsedMinutes < 10) return 'bg-amber-100 text-amber-800'
    return 'bg-red-100 text-red-800'
  }
  const getChannelBadgeColor = () => {
    switch (ticket.channel) {
      case 'DINE_IN':
        return 'bg-blue-100 text-blue-800'
      case 'TAKEAWAY':
        return 'bg-green-100 text-green-800'
      case 'DELIVERY':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  const getNextAction = () => {
    switch (ticket.status) {
      case 'NEW':
        return {
          label: t('kitchen.actions.start'),
          nextStatus: 'IN_PROGRESS',
          variant: 'default',
        }
      case 'IN_PROGRESS':
        return {
          label: t('kitchen.actions.ready'),
          nextStatus: 'READY',
          variant: 'default',
        }
      case 'READY':
        return {
          label: t('kitchen.actions.serve'),
          nextStatus: 'SERVED',
          variant: 'accent',
        }
      default:
        return null
    }
  }
  // Group lines by station
  const linesByStation = ticket.lines.reduce((acc, line) => {
    const station = line.station || 'OTHER'
    if (!acc[station]) acc[station] = []
    acc[station].push(line)
    return acc
  }, {})
  const nextAction = getNextAction()
  const isCompact = density === 'compact'
  return _jsxs('div', {
    className: cn(
      'rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md',
      className
    ),
    children: [
      _jsxs('div', {
        className: cn('p-4', isCompact && 'p-3'),
        children: [
          _jsxs('div', {
            className: 'mb-3 flex items-center justify-between',
            children: [
              _jsxs('div', {
                className: 'flex items-center gap-2',
                children: [
                  _jsx('h3', {
                    className: cn(
                      'font-bold text-gray-900',
                      isCompact ? 'text-lg' : 'text-xl'
                    ),
                    children: ticket.number,
                  }),
                  ticket.priority &&
                    _jsx('div', {
                      className: 'bg-accent h-2 w-2 rounded-full',
                      title: t('kitchen.priority'),
                    }),
                ],
              }),
              _jsxs('div', {
                className: 'flex items-center gap-2',
                children: [
                  _jsxs('div', {
                    className: cn(
                      'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                      getElapsedStyle()
                    ),
                    children: [
                      _jsx(Clock, { className: 'h-3 w-3' }),
                      elapsedMinutes,
                      'm',
                    ],
                  }),
                  _jsx(Badge, {
                    className: cn('text-xs', getChannelBadgeColor()),
                    children: ticket.channel.replace('_', ' '),
                  }),
                ],
              }),
            ],
          }),
          ticket.tableNo &&
            _jsxs('div', {
              className: 'mb-3 flex items-center gap-1 text-sm text-gray-600',
              children: [
                _jsx(MapPin, { className: 'h-4 w-4' }),
                t('kitchen.table'),
                ' ',
                ticket.tableNo,
              ],
            }),
          _jsx('div', {
            className: 'space-y-3',
            children: Object.entries(linesByStation).map(([station, lines]) =>
              _jsxs(
                'div',
                {
                  className: 'space-y-1',
                  children: [
                    station !== 'OTHER' &&
                      _jsx('div', {
                        className:
                          'text-xs font-medium tracking-wide text-gray-500 uppercase',
                        children: station,
                      }),
                    lines.map((line, idx) =>
                      _jsx(
                        'div',
                        {
                          className: cn(
                            'flex items-start justify-between',
                            isCompact ? 'text-sm' : 'text-base'
                          ),
                          children: _jsxs('div', {
                            className: 'flex-1',
                            children: [
                              _jsxs('div', {
                                className: 'font-medium text-gray-900',
                                children: [line.qty, '\u00D7 ', line.name],
                              }),
                              line.modifiers &&
                                line.modifiers.length > 0 &&
                                _jsx('div', {
                                  className: 'mt-1 text-xs text-gray-600',
                                  children: line.modifiers.map((mod, i) =>
                                    _jsxs(
                                      'div',
                                      {
                                        children: [
                                          '+ ',
                                          mod.name,
                                          ': ',
                                          mod.value,
                                        ],
                                      },
                                      i
                                    )
                                  ),
                                }),
                            ],
                          }),
                        },
                        idx
                      )
                    ),
                  ],
                },
                station
              )
            ),
          }),
          ticket.note &&
            _jsx('div', {
              className:
                'mt-3 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-2',
              children: _jsxs('div', {
                className: 'flex items-start gap-2',
                children: [
                  _jsx(StickyNote, {
                    className: 'mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600',
                  }),
                  _jsxs('div', {
                    className: 'text-sm text-yellow-800',
                    children: [
                      _jsxs('div', {
                        className: 'font-medium',
                        children: [t('kitchen.note'), ':'],
                      }),
                      _jsx('div', { children: ticket.note }),
                    ],
                  }),
                ],
              }),
            }),
        ],
      }),
      nextAction &&
        _jsx('div', {
          className: 'px-4 pb-4',
          children: _jsx(Button, {
            onClick: () => onStatusChange(ticket.id, nextAction.nextStatus),
            variant: nextAction.variant,
            className: 'w-full',
            size: isCompact ? 'sm' : 'default',
            children: nextAction.label,
          }),
        }),
    ],
  })
}
