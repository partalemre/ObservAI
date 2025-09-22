import React from 'react'
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}
export declare const Label: React.ForwardRefExoticComponent<
  LabelProps & React.RefAttributes<HTMLLabelElement>
>
export {}
