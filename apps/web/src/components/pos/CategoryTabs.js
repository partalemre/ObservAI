import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { cn } from '../../lib/utils'
export const CategoryTabs = ({
  categories,
  activeCategory,
  onCategoryChange,
  allLabel = 'All',
  className,
}) => {
  const sortedCategories = [...categories].sort((a, b) => a.sort - b.sort)
  return _jsxs('div', {
    className: cn('flex space-x-1 overflow-x-auto pb-2', className),
    children: [
      _jsxs('button', {
        type: 'button',
        onClick: () => onCategoryChange(null),
        className: cn(
          'relative flex-shrink-0 px-4 py-2 text-sm font-medium transition-colors',
          activeCategory === null
            ? 'text-brand'
            : 'text-gray-600 hover:text-gray-900'
        ),
        children: [
          allLabel,
          activeCategory === null &&
            _jsx('div', {
              className:
                'from-brand to-accent absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r',
            }),
        ],
      }),
      sortedCategories.map((category) =>
        _jsxs(
          'button',
          {
            type: 'button',
            onClick: () => onCategoryChange(category.id),
            className: cn(
              'relative flex-shrink-0 px-4 py-2 text-sm font-medium transition-colors',
              activeCategory === category.id
                ? 'text-brand'
                : 'text-gray-600 hover:text-gray-900'
            ),
            children: [
              category.name,
              activeCategory === category.id &&
                _jsx('div', {
                  className:
                    'from-brand to-accent absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r',
                }),
            ],
          },
          category.id
        )
      ),
    ],
  })
}
