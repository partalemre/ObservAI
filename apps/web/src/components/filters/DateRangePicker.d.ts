import React from 'react'
interface DateRangePickerProps {
  onRangeChange: (range: { from: string; to: string }) => void
  className?: string
}
export declare const DateRangePicker: React.FC<DateRangePickerProps>
export {}
