import React from 'react'
import { Title, EmptyState } from '../../components/ui'
import { t } from '../../lib/i18n'

export const Kitchen: React.FC = () => {
  return (
    <div className="p-6">
      <Title level={1} className="mb-6">
        {t('pages.kitchen')}
      </Title>
      <EmptyState
        title={t('pages.kitchen')}
        description={t('pages.kitchenDesc')}
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
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            />
          </svg>
        }
      />
    </div>
  )
}
