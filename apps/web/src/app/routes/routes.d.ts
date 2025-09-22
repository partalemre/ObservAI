import React from 'react'
export declare const ProtectedLayout: React.FC
export declare const RootRedirect: React.FC
export declare const routesConfig: (
  | {
      path: string
      element: import('react/jsx-runtime').JSX.Element
      children?: undefined
    }
  | {
      element: import('react/jsx-runtime').JSX.Element
      children: {
        path: string
        element: import('react/jsx-runtime').JSX.Element
      }[]
      path?: undefined
    }
)[]
export declare const router: import('react-router-dom').DataRouter
export declare const createTestRouter: (
  initialPath?: string
) => import('react-router-dom').DataRouter
