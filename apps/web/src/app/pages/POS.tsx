import React from 'react'
import { Title, EmptyState } from '../../components/ui'
import { t } from '../../lib/i18n'

export const POS: React.FC = () => {
  return (
    <div className="p-6">
      <Title level={1} className="mb-6">
        {t('pages.pos')}
      </Title>
      <EmptyState
        title={t('pages.pos')}
        description={t('pages.posDesc')}
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
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
      />
    </div>
  )
}
