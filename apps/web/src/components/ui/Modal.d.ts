import React from 'react'
interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}
export declare const Modal: React.FC<ModalProps>
export {}
