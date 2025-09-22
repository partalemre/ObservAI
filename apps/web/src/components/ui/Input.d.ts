import React from 'react'
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helperText?: string
}
export declare const Input: React.ForwardRefExoticComponent<
  InputProps & React.RefAttributes<HTMLInputElement>
>
export {}
