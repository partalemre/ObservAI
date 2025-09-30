import React from 'react'
interface NavItemProps {
  icon: React.ComponentType<any>
  label: string
  path: string
  collapsed: boolean
}
export declare const NavItem: React.FC<NavItemProps>
export {}
