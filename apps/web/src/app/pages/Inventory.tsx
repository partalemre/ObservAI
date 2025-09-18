import React from 'react'
import { Title, EmptyState } from '../../components/ui'
import { t } from '../../lib/i18n'

export const Inventory: React.FC = () => {
  return (
    <div className="p-6">
      <Title level={1} className="mb-6">
        {t('pages.inventory')}
      </Title>
      <EmptyState
        title={t('pages.inventory')}
        description={t('pages.inventoryDesc')}
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        }
      />
    </div>
  )
}
