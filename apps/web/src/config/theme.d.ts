/**
 * ObservAI Theme Configuration
 * Kibsi-inspired glass UI with modern color palette
 */
export declare const theme: {
  readonly colors: {
    readonly surface: {
      readonly darkest: '#0b0b10'
      readonly dark: '#12131a'
      readonly glass: 'rgba(20, 20, 28, 0.35)'
    }
    readonly accent: {
      readonly purple: '#7C4DFF'
      readonly blue: '#4FC3F7'
      readonly lime: '#D4FB54'
      readonly orange: '#FFB74D'
      readonly red: '#FF5252'
    }
    readonly border: {
      readonly default: 'rgba(255, 255, 255, 0.12)'
      readonly light: 'rgba(255, 255, 255, 0.18)'
      readonly glow: 'rgba(124, 77, 255, 0.35)'
    }
    readonly text: {
      readonly primary: '#E8E9ED'
      readonly secondary: '#9CA3B4'
      readonly dim: '#6B7280'
    }
    readonly status: {
      readonly safe: '#4FC3F7'
      readonly moderate: '#FFB74D'
      readonly critical: '#FF5252'
      readonly success: '#D4FB54'
    }
  }
  readonly gradients: {
    readonly primary: 'linear-gradient(135deg, #7C4DFF 0%, #4FC3F7 100%)'
    readonly secondary: 'linear-gradient(135deg, #FFB74D 0%, #FF5252 100%)'
    readonly success: 'linear-gradient(135deg, #D4FB54 0%, #4FC3F7 100%)'
    readonly glass: 'linear-gradient(135deg, rgba(124, 77, 255, 0.1) 0%, rgba(79, 195, 247, 0.1) 100%)'
  }
  readonly shadows: {
    readonly sm: '0 2px 8px rgba(0, 0, 0, 0.15)'
    readonly md: '0 4px 16px rgba(0, 0, 0, 0.25)'
    readonly lg: '0 8px 32px rgba(0, 0, 0, 0.35)'
    readonly glow: '0 0 24px rgba(124, 77, 255, 0.45)'
    readonly glowBlue: '0 0 24px rgba(79, 195, 247, 0.45)'
  }
  readonly blur: {
    readonly sm: 'blur(12px)'
    readonly md: 'blur(22px)'
    readonly lg: 'blur(32px)'
  }
  readonly typography: {
    readonly fontFamily: {
      readonly sans: '"Inter", "Plus Jakarta Sans", system-ui, sans-serif'
      readonly mono: '"JetBrains Mono", monospace'
    }
    readonly fontSize: {
      readonly kpi: '30px'
      readonly heading: '18px'
      readonly body: '14px'
      readonly caption: '12px'
      readonly label: '11px'
    }
    readonly fontWeight: {
      readonly regular: 400
      readonly medium: 500
      readonly semibold: 600
      readonly bold: 700
    }
  }
  readonly animation: {
    readonly duration: {
      readonly fast: '200ms'
      readonly normal: '350ms'
      readonly slow: '500ms'
    }
    readonly easing: {
      readonly default: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
      readonly in: 'cubic-bezier(0.4, 0.0, 1, 1)'
      readonly out: 'cubic-bezier(0.0, 0.0, 0.2, 1)'
      readonly inOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
    }
  }
  readonly layout: {
    readonly borderRadius: {
      readonly sm: '6px'
      readonly md: '12px'
      readonly lg: '16px'
      readonly xl: '24px'
    }
    readonly spacing: {
      readonly xs: '4px'
      readonly sm: '8px'
      readonly md: '16px'
      readonly lg: '24px'
      readonly xl: '32px'
    }
  }
}
export type Theme = typeof theme
/**
 * Convert age to bucket
 */
export declare function ageToBucket(
  age: number | null
): 'child' | 'young' | 'adult' | 'mature' | 'senior' | 'unknown'
/**
 * Format dwell time to mm:ss
 */
export declare function formatDwellTime(seconds: number): string
/**
 * Format percentage
 */
export declare function formatPercent(value: number, total: number): string
/**
 * Get color for age bucket
 */
export declare function ageBucketColor(bucket: string): string
/**
 * Get color for gender
 */
export declare function genderColor(gender: string): string
