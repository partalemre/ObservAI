import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { Title, Button } from '../../components/ui'
import { t } from '../../lib/i18n'
import { useOrgStore } from '../../store/orgStore'
import { CategoryList } from '../../components/menu/CategoryList'
import { ItemList } from '../../components/menu/ItemList'
import { GroupList } from '../../components/menu/GroupList'
import { CategoryFormDialog } from '../../components/menu/CategoryFormDialog'
import { ItemFormDrawer } from '../../components/menu/ItemFormDrawer'
import { GroupFormDialog } from '../../components/menu/GroupFormDialog'
export const Menu = () => {
  const { selectedStoreId } = useOrgStore()
  const [activeTab, setActiveTab] = useState('items')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  if (!selectedStoreId) {
    return _jsxs('div', {
      className: 'p-6',
      children: [
        _jsx(Title, { level: 1, className: 'mb-6', children: t('menu.title') }),
        _jsx('div', {
          className: 'py-8 text-center text-slate-500',
          children: _jsx('p', {
            children: 'Please select a store to manage menu items',
          }),
        }),
      ],
    })
  }
  const tabs = [
    { id: 'items', label: t('menu.tabs.items') },
    { id: 'categories', label: t('menu.tabs.categories') },
    { id: 'groups', label: t('menu.tabs.groups') },
  ]
  const getActionButton = () => {
    switch (activeTab) {
      case 'items':
        return _jsx(Button, {
          onClick: () => setShowCreateDialog(true),
          children: t('menu.actions.newItem'),
        })
      case 'categories':
        return _jsx(Button, {
          onClick: () => setShowCreateDialog(true),
          children: t('menu.actions.newCategory'),
        })
      case 'groups':
        return _jsx(Button, {
          onClick: () => setShowCreateDialog(true),
          children: t('menu.actions.newGroup'),
        })
    }
  }
  const renderTabContent = () => {
    switch (activeTab) {
      case 'items':
        return _jsx(ItemList, { storeId: selectedStoreId })
      case 'categories':
        return _jsx(CategoryList, { storeId: selectedStoreId })
      case 'groups':
        return _jsx(GroupList, { storeId: selectedStoreId })
    }
  }
  const renderCreateDialog = () => {
    if (!showCreateDialog) return null
    switch (activeTab) {
      case 'items':
        return _jsx(ItemFormDrawer, {
          storeId: selectedStoreId,
          onClose: () => setShowCreateDialog(false),
        })
      case 'categories':
        return _jsx(CategoryFormDialog, {
          storeId: selectedStoreId,
          onClose: () => setShowCreateDialog(false),
        })
      case 'groups':
        return _jsx(GroupFormDialog, {
          storeId: selectedStoreId,
          onClose: () => setShowCreateDialog(false),
        })
    }
  }
  return _jsxs('div', {
    className: 'p-6',
    children: [
      _jsxs('div', {
        className: 'mb-6 flex items-center justify-between',
        children: [
          _jsx(Title, {
            level: 1,
            className: 'text-slate-900',
            children: t('menu.title'),
          }),
          getActionButton(),
        ],
      }),
      _jsx('div', {
        className: 'mb-6 border-b border-slate-200',
        children: _jsx('nav', {
          className: '-mb-px flex space-x-8',
          children: tabs.map((tab) =>
            _jsx(
              'button',
              {
                onClick: () => setActiveTab(tab.id),
                className: `border-b-2 px-1 pb-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                } `,
                children: tab.label,
              },
              tab.id
            )
          ),
        }),
      }),
      _jsx('div', { className: 'space-y-6', children: renderTabContent() }),
      renderCreateDialog(),
    ],
  })
}
