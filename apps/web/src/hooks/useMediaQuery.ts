import { useState, useEffect } from 'react'

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia(query)

    // Set initial value
    setMatches(mediaQuery.matches)

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}

// Predefined breakpoint hooks for common use cases
export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
export const useIsTablet = () =>
  useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)')
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1280px)')

// Responsive breakpoint utilities
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// Media query strings
export const mediaQueries = {
  mobile: `(max-width: ${breakpoints.md})`,
  tablet: `(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  desktop: `(min-width: ${breakpoints.lg})`,
  wide: `(min-width: ${breakpoints.xl})`,
  ultraWide: `(min-width: ${breakpoints['2xl']})`,
} as const

// Hook for multiple breakpoints
export const useBreakpoints = () => {
  const isMobile = useMediaQuery(mediaQueries.mobile)
  const isTablet = useMediaQuery(mediaQueries.tablet)
  const isDesktop = useMediaQuery(mediaQueries.desktop)
  const isWide = useMediaQuery(mediaQueries.wide)
  const isUltraWide = useMediaQuery(mediaQueries.ultraWide)

  return {
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    isUltraWide,
    // Utility properties
    isMobileOrTablet: isMobile || isTablet,
    isDesktopOrWider: isDesktop || isWide || isUltraWide,
    currentBreakpoint: isMobile
      ? 'mobile'
      : isTablet
        ? 'tablet'
        : isDesktop
          ? 'desktop'
          : isWide
            ? 'wide'
            : 'ultraWide',
  }
}
