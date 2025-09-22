import React, { useState } from 'react'
import { Title, Button } from '../../components/ui'
import { t } from '../../lib/i18n'
import { useOrgStore } from '../../store/orgStore'
import { CategoryList } from '../../components/menu/CategoryList'
import { ItemList } from '../../components/menu/ItemList'
import { GroupList } from '../../components/menu/GroupList'
import { CategoryFormDialog } from '../../components/menu/CategoryFormDialog'
import { ItemFormDrawer } from '../../components/menu/ItemFormDrawer'
import { GroupFormDialog } from '../../components/menu/GroupFormDialog'

type TabType = 'items' | 'categories' | 'groups'

export const Menu: React.FC = () => {
  const { selectedStoreId } = useOrgStore()
  const [activeTab, setActiveTab] = useState<TabType>('items')
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  if (!selectedStoreId) {
    return (
      <div className="p-6">
        <Title level={1} className="mb-6">
          {t('menu.title')}
        </Title>
        <div className="py-8 text-center text-slate-500">
          <p>Please select a store to manage menu items</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'items' as const, label: t('menu.tabs.items') },
    { id: 'categories' as const, label: t('menu.tabs.categories') },
    { id: 'groups' as const, label: t('menu.tabs.groups') },
  ]

  const getActionButton = () => {
    switch (activeTab) {
      case 'items':
        return (
          <Button onClick={() => setShowCreateDialog(true)}>
            {t('menu.actions.newItem')}
          </Button>
        )
      case 'categories':
        return (
          <Button onClick={() => setShowCreateDialog(true)}>
            {t('menu.actions.newCategory')}
          </Button>
        )
      case 'groups':
        return (
          <Button onClick={() => setShowCreateDialog(true)}>
            {t('menu.actions.newGroup')}
          </Button>
        )
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'items':
        return <ItemList storeId={selectedStoreId} />
      case 'categories':
        return <CategoryList storeId={selectedStoreId} />
      case 'groups':
        return <GroupList storeId={selectedStoreId} />
    }
  }

  const renderCreateDialog = () => {
    if (!showCreateDialog) return null

    switch (activeTab) {
      case 'items':
        return (
          <ItemFormDrawer
            storeId={selectedStoreId}
            onClose={() => setShowCreateDialog(false)}
          />
        )
      case 'categories':
        return (
          <CategoryFormDialog
            storeId={selectedStoreId}
            onClose={() => setShowCreateDialog(false)}
          />
        )
      case 'groups':
        return (
          <GroupFormDialog
            storeId={selectedStoreId}
            onClose={() => setShowCreateDialog(false)}
          />
        )
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Title level={1} className="text-slate-900">
          {t('menu.title')}
        </Title>
        {getActionButton()}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-1 pb-2 text-sm font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              } `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">{renderTabContent()}</div>

      {/* Create Dialogs */}
      {renderCreateDialog()}
    </div>
  )
}
