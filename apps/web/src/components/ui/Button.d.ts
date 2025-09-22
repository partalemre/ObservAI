import React from 'react'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  asChild?: boolean
}
export declare const Button: React.FC<ButtonProps>
export {}
