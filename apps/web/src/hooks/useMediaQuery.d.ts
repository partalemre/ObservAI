export declare const useMediaQuery: (query: string) => boolean
export declare const useIsMobile: () => boolean
export declare const useIsTablet: () => boolean
export declare const useIsDesktop: () => boolean
export declare const useIsLargeDesktop: () => boolean
export declare const breakpoints: {
  readonly sm: '640px'
  readonly md: '768px'
  readonly lg: '1024px'
  readonly xl: '1280px'
  readonly '2xl': '1536px'
}
export declare const mediaQueries: {
  readonly mobile: '(max-width: 768px)'
  readonly tablet: '(min-width: 768px) and (max-width: 1024px)'
  readonly desktop: '(min-width: 1024px)'
  readonly wide: '(min-width: 1280px)'
  readonly ultraWide: '(min-width: 1536px)'
}
export declare const useBreakpoints: () => {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isWide: boolean
  isUltraWide: boolean
  isMobileOrTablet: boolean
  isDesktopOrWider: boolean
  currentBreakpoint: string
}
