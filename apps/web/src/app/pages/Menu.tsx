import React from 'react'
import { Title, EmptyState } from '../../components/ui'
import { t } from '../../lib/i18n'

export const Menu: React.FC = () => {
  return (
    <div className="p-6">
      <Title level={1} className="mb-6">
        {t('pages.menu')}
      </Title>
      <EmptyState
        title={t('pages.menu')}
        description={t('pages.menuDesc')}
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
              d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h10a2 2 0 002-2V7a2 2 0 00-2-2H9m0 10v6a2 2 0 002 2h6a2 2 0 002-2v-6m-8 0V9a2 2 0 012-2h2a2 2 0 012 2v4m-6 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2h2z"
            />
          </svg>
        }
      />
    </div>
  )
}
