import { Variants, Transition } from 'framer-motion'
export declare const pageTransition: Variants
export declare const staggerChildren: Variants
export declare const staggerChildrenFast: Variants
export declare const staggerChildrenSlow: Variants
export declare const cardVariants: Variants
export declare const modalVariants: Variants
export declare const backdropVariants: Variants
export declare const slideInFromRight: Variants
export declare const slideInFromLeft: Variants
export declare const slideInFromTop: Variants
export declare const slideInFromBottom: Variants
export declare const scaleIn: Variants
export declare const fadeIn: Variants
export declare const fadeInUp: Variants
export declare const listItemVariants: Variants
export declare const buttonVariants: Variants
export declare const numberCountVariants: Variants
export declare const notificationVariants: Variants
export declare const spinnerVariants: Variants
export declare const pulseVariants: Variants
export declare const springTransition: Transition
export declare const easeTransition: Transition
export declare const quickTransition: Transition
export declare const createStaggerVariants: (staggerDelay?: number) => Variants
export declare const createSlideVariants: (
  direction?: 'up' | 'down' | 'left' | 'right',
  distance?: number
) => Variants
export declare const createScaleVariants: (initialScale?: number) => Variants
export declare const layoutTransition: Transition
export declare const dragConstraints: {
  top: number
  left: number
  right: number
  bottom: number
}
export declare const swipeConfidenceThreshold = 10000
export declare const swipePower: (offset: number, velocity: number) => number
