import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from 'react/jsx-runtime'
import { X, Clock, MapPin, StickyNote, User } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { t } from '../../lib/i18n'
export const OrderDetailDrawer = ({
  ticket,
  open,
  onClose,
  onStatusChange,
}) => {
  if (!ticket) return null
  const elapsedMinutes = Math.floor(
    (Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60)
  )
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
  const getStatusBadgeColor = () => {
    switch (ticket.status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-800'
      case 'READY':
        return 'bg-green-100 text-green-800'
      case 'SERVED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  const getNextActions = () => {
    const actions = []
    switch (ticket.status) {
      case 'NEW':
        actions.push({
          label: t('kitchen.actions.start'),
          nextStatus: 'IN_PROGRESS',
          variant: 'default',
        })
        break
      case 'IN_PROGRESS':
        actions.push({
          label: t('kitchen.actions.ready'),
          nextStatus: 'READY',
          variant: 'default',
        })
        break
      case 'READY':
        actions.push({
          label: t('kitchen.actions.serve'),
          nextStatus: 'SERVED',
          variant: 'accent',
        })
        break
    }
    return actions
  }
  // Group lines by station
  const linesByStation = ticket.lines.reduce((acc, line) => {
    const station = line.station || 'OTHER'
    if (!acc[station]) acc[station] = []
    acc[station].push(line)
    return acc
  }, {})
  const nextActions = getNextActions()
  return _jsxs(_Fragment, {
    children: [
      open &&
        _jsx('div', {
          className: 'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm',
          onClick: onClose,
        }),
      _jsx('div', {
        className: cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-lg transform bg-white shadow-xl transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full'
        ),
        children: _jsxs('div', {
          className: 'flex h-full flex-col',
          children: [
            _jsxs('div', {
              className:
                'flex items-center justify-between border-b border-gray-200 p-6',
              children: [
                _jsxs('div', {
                  children: [
                    _jsx('h2', {
                      className: 'text-2xl font-bold text-gray-900',
                      children: ticket.number,
                    }),
                    _jsx('p', {
                      className: 'mt-1 text-sm text-gray-600',
                      children: 'Order details',
                    }),
                  ],
                }),
                _jsx(Button, {
                  variant: 'ghost',
                  size: 'sm',
                  onClick: onClose,
                  className: 'text-gray-500 hover:text-gray-700',
                  children: _jsx(X, { className: 'h-5 w-5' }),
                }),
              ],
            }),
            _jsxs('div', {
              className: 'flex-1 space-y-6 overflow-y-auto p-6',
              children: [
                _jsxs('div', {
                  className: 'space-y-4',
                  children: [
                    _jsxs('div', {
                      className: 'flex items-center justify-between',
                      children: [
                        _jsxs('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            _jsx(Badge, {
                              className: getStatusBadgeColor(),
                              children: ticket.status.replace('_', ' '),
                            }),
                            _jsx(Badge, {
                              className: getChannelBadgeColor(),
                              children: ticket.channel.replace('_', ' '),
                            }),
                            ticket.priority &&
                              _jsx(Badge, {
                                className: 'bg-accent text-white',
                                children: t('kitchen.priority'),
                              }),
                          ],
                        }),
                        _jsxs('div', {
                          className:
                            'flex items-center gap-1 text-sm text-gray-600',
                          children: [
                            _jsx(Clock, { className: 'h-4 w-4' }),
                            elapsedMinutes,
                            'm ',
                            t('kitchen.elapsed').toLowerCase(),
                          ],
                        }),
                      ],
                    }),
                    ticket.tableNo &&
                      _jsxs('div', {
                        className:
                          'flex items-center gap-2 text-sm text-gray-600',
                        children: [
                          _jsx(MapPin, { className: 'h-4 w-4' }),
                          t('kitchen.table'),
                          ' ',
                          ticket.tableNo,
                        ],
                      }),
                    _jsxs('div', {
                      className:
                        'flex items-center gap-2 text-sm text-gray-600',
                      children: [
                        _jsx(User, { className: 'h-4 w-4' }),
                        'Created',
                        ' ',
                        formatDistanceToNow(new Date(ticket.createdAt), {
                          addSuffix: true,
                        }),
                      ],
                    }),
                  ],
                }),
                _jsxs('div', {
                  className: 'space-y-6',
                  children: [
                    _jsx('h3', {
                      className: 'text-lg font-semibold text-gray-900',
                      children: 'Items',
                    }),
                    Object.entries(linesByStation).map(([station, lines]) =>
                      _jsxs(
                        'div',
                        {
                          className: 'space-y-3',
                          children: [
                            station !== 'OTHER' &&
                              _jsxs('h4', {
                                className:
                                  'border-b border-gray-200 pb-2 text-sm font-medium tracking-wide text-gray-500 uppercase',
                                children: [station, ' Station'],
                              }),
                            lines.map((line, idx) =>
                              _jsxs(
                                'div',
                                {
                                  className: 'rounded-lg bg-gray-50 p-4',
                                  children: [
                                    _jsxs('div', {
                                      className:
                                        'mb-2 flex items-start justify-between',
                                      children: [
                                        _jsx('div', {
                                          className:
                                            'font-medium text-gray-900',
                                          children: line.name,
                                        }),
                                        _jsxs('div', {
                                          className: 'text-sm text-gray-600',
                                          children: ['Qty: ', line.qty],
                                        }),
                                      ],
                                    }),
                                    line.modifiers &&
                                      line.modifiers.length > 0 &&
                                      _jsx('div', {
                                        className: 'space-y-1',
                                        children: line.modifiers.map((mod, i) =>
                                          _jsxs(
                                            'div',
                                            {
                                              className:
                                                'text-sm text-gray-600',
                                              children: [
                                                _jsxs('span', {
                                                  className: 'font-medium',
                                                  children: [mod.name, ':'],
                                                }),
                                                ' ',
                                                mod.value,
                                              ],
                                            },
                                            i
                                          )
                                        ),
                                      }),
                                  ],
                                },
                                idx
                              )
                            ),
                          ],
                        },
                        station
                      )
                    ),
                  ],
                }),
                ticket.note &&
                  _jsxs('div', {
                    className: 'space-y-2',
                    children: [
                      _jsx('h3', {
                        className: 'text-lg font-semibold text-gray-900',
                        children: 'Special Instructions',
                      }),
                      _jsx('div', {
                        className:
                          'rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4',
                        children: _jsxs('div', {
                          className: 'flex items-start gap-2',
                          children: [
                            _jsx(StickyNote, {
                              className:
                                'mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600',
                            }),
                            _jsx('p', {
                              className: 'text-yellow-800',
                              children: ticket.note,
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
              ],
            }),
            nextActions.length > 0 &&
              _jsx('div', {
                className: 'space-y-3 border-t border-gray-200 p-6',
                children: nextActions.map((action) =>
                  _jsx(
                    Button,
                    {
                      onClick: () => {
                        onStatusChange(ticket.id, action.nextStatus)
                        onClose()
                      },
                      variant: action.variant,
                      className: 'w-full',
                      children: action.label,
                    },
                    action.nextStatus
                  )
                ),
              }),
          ],
        }),
      }),
    ],
  })
}
