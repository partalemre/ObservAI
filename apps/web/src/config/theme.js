/**
 * ObservAI Theme Configuration
 * Kibsi-inspired glass UI with modern color palette
 */
export const theme = {
  colors: {
    // Base surfaces (dark mode)
    surface: {
      darkest: '#0b0b10',
      dark: '#12131a',
      glass: 'rgba(20, 20, 28, 0.35)',
    },
    // Accent colors
    accent: {
      purple: '#7C4DFF',
      blue: '#4FC3F7',
      lime: '#D4FB54',
      orange: '#FFB74D',
      red: '#FF5252',
    },
    // Borders and dividers
    border: {
      default: 'rgba(255, 255, 255, 0.12)',
      light: 'rgba(255, 255, 255, 0.18)',
      glow: 'rgba(124, 77, 255, 0.35)',
    },
    // Text
    text: {
      primary: '#E8E9ED',
      secondary: '#9CA3B4',
      dim: '#6B7280',
    },
    // Status colors
    status: {
      safe: '#4FC3F7',
      moderate: '#FFB74D',
      critical: '#FF5252',
      success: '#D4FB54',
    },
  },
  gradients: {
    primary: 'linear-gradient(135deg, #7C4DFF 0%, #4FC3F7 100%)',
    secondary: 'linear-gradient(135deg, #FFB74D 0%, #FF5252 100%)',
    success: 'linear-gradient(135deg, #D4FB54 0%, #4FC3F7 100%)',
    glass:
      'linear-gradient(135deg, rgba(124, 77, 255, 0.1) 0%, rgba(79, 195, 247, 0.1) 100%)',
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.15)',
    md: '0 4px 16px rgba(0, 0, 0, 0.25)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.35)',
    glow: '0 0 24px rgba(124, 77, 255, 0.45)',
    glowBlue: '0 0 24px rgba(79, 195, 247, 0.45)',
  },
  blur: {
    sm: 'blur(12px)',
    md: 'blur(22px)',
    lg: 'blur(32px)',
  },
  typography: {
    fontFamily: {
      sans: '"Inter", "Plus Jakarta Sans", system-ui, sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
    fontSize: {
      kpi: '30px',
      heading: '18px',
      body: '14px',
      caption: '12px',
      label: '11px',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  animation: {
    duration: {
      fast: '200ms',
      normal: '350ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0.0, 1, 1)',
      out: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    },
  },
  layout: {
    borderRadius: {
      sm: '6px',
      md: '12px',
      lg: '16px',
      xl: '24px',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
  },
}
/**
 * Convert age to bucket
 */
export function ageToBucket(age) {
  if (age === null || age === undefined) return 'unknown'
  if (age < 18) return 'child'
  if (age < 36) return 'young'
  if (age < 51) return 'adult'
  if (age < 71) return 'mature'
  return 'senior'
}
/**
 * Format dwell time to mm:ss
 */
export function formatDwellTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
/**
 * Format percentage
 */
export function formatPercent(value, total) {
  if (total === 0) return '0%'
  return `${Math.round((value / total) * 100)}%`
}
/**
 * Get color for age bucket
 */
export function ageBucketColor(bucket) {
  const colors = {
    child: theme.colors.accent.lime,
    young: theme.colors.accent.blue,
    adult: theme.colors.accent.purple,
    mature: theme.colors.accent.orange,
    senior: theme.colors.accent.red,
    unknown: theme.colors.text.dim,
  }
  return colors[bucket] || colors.unknown
}
/**
 * Get color for gender
 */
export function genderColor(gender) {
  const colors = {
    male: theme.colors.accent.blue,
    female: theme.colors.accent.purple,
    unknown: theme.colors.text.dim,
  }
  return colors[gender] || colors.unknown
}
