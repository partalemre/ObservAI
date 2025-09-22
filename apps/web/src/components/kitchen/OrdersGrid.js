import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { cn } from '../../lib/utils'
import { OrderCard } from './OrderCard'
import { EmptyState } from '../ui/EmptyState'
import { useKitchenStore } from '../../store/kitchenStore'
import { t } from '../../lib/i18n'
export const OrdersGrid = ({ tickets, onStatusChange, className }) => {
  const { density } = useKitchenStore()
  // Group tickets by status
  const ticketsByStatus = {
    NEW: tickets.filter((t) => t.status === 'NEW'),
    IN_PROGRESS: tickets.filter((t) => t.status === 'IN_PROGRESS'),
    READY: tickets.filter((t) => t.status === 'READY'),
  }
  const columns = [
    {
      status: 'NEW',
      title: t('kitchen.status.new'),
      tickets: ticketsByStatus.NEW,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      status: 'IN_PROGRESS',
      title: t('kitchen.status.inprogress'),
      tickets: ticketsByStatus.IN_PROGRESS,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      status: 'READY',
      title: t('kitchen.status.ready'),
      tickets: ticketsByStatus.READY,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
  ]
  if (tickets.length === 0) {
    return _jsx('div', {
      className: cn('flex h-96 items-center justify-center', className),
      children: _jsx(EmptyState, {
        title: t('kitchen.empty'),
        description: 'New orders will appear here automatically',
      }),
    })
  }
  return _jsxs('div', {
    className: cn('flex-1 overflow-hidden', className),
    children: [
      _jsx('div', {
        className: 'hidden h-full gap-6 p-6 lg:flex',
        children: columns.map((column) =>
          _jsxs(
            'div',
            {
              className: 'flex min-w-0 flex-1 flex-col',
              children: [
                _jsxs('div', {
                  className: cn(
                    'flex items-center justify-between rounded-t-2xl border-b p-4',
                    column.bgColor,
                    column.borderColor
                  ),
                  children: [
                    _jsx('h2', {
                      className: 'font-semibold text-gray-900',
                      children: column.title,
                    }),
                    _jsxs('div', {
                      className: 'flex items-center gap-2',
                      children: [
                        _jsx('span', {
                          className: 'text-sm font-medium text-gray-600',
                          children: column.tickets.length,
                        }),
                        _jsx('div', {
                          className:
                            'from-brand to-accent h-0.5 w-8 rounded-full bg-gradient-to-r',
                        }),
                      ],
                    }),
                  ],
                }),
                _jsx('div', {
                  className: cn(
                    'flex-1 space-y-4 overflow-y-auto rounded-b-2xl border-r border-b border-l p-4',
                    column.bgColor,
                    column.borderColor
                  ),
                  children:
                    column.tickets.length === 0
                      ? _jsx('div', {
                          className:
                            'flex h-32 items-center justify-center text-gray-500',
                          children: _jsxs('span', {
                            className: 'text-sm',
                            children: [
                              'No ',
                              column.title.toLowerCase(),
                              ' orders',
                            ],
                          }),
                        })
                      : column.tickets.map((ticket) =>
                          _jsx(
                            OrderCard,
                            {
                              ticket: ticket,
                              onStatusChange: onStatusChange,
                              density: density,
                            },
                            ticket.id
                          )
                        ),
                }),
              ],
            },
            column.status
          )
        ),
      }),
      _jsxs('div', {
        className: 'flex h-full flex-col lg:hidden',
        children: [
          _jsx('div', {
            className: 'flex border-b border-gray-200 bg-white',
            children: columns.map((column) =>
              _jsxs(
                'button',
                {
                  className:
                    'flex-1 border-b-2 border-transparent px-4 py-3 text-center hover:border-gray-300 focus:outline-none',
                  children: [
                    _jsx('div', {
                      className: 'font-medium text-gray-900',
                      children: column.title,
                    }),
                    _jsxs('div', {
                      className: 'mt-1 text-xs text-gray-500',
                      children: [column.tickets.length, ' orders'],
                    }),
                  ],
                },
                column.status
              )
            ),
          }),
          _jsx('div', {
            className: 'flex-1 space-y-4 overflow-y-auto p-4',
            children: tickets.map((ticket) =>
              _jsx(
                OrderCard,
                {
                  ticket: ticket,
                  onStatusChange: onStatusChange,
                  density: density,
                },
                ticket.id
              )
            ),
          }),
        ],
      }),
    ],
  })
}
