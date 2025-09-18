import React from 'react'
import { Title, EmptyState } from '../../components/ui'
import { t } from '../../lib/i18n'

export const Alerts: React.FC = () => {
  return (
    <div className="p-6">
      <Title level={1} className="mb-6">
        {t('pages.alerts')}
      </Title>
      <EmptyState
        title={t('pages.alerts')}
        description={t('pages.alertsDesc')}
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
              d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
    </div>
  )
}
