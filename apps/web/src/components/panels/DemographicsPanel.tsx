/**
 * Demographics Panel
 * Shows gender and age distribution with animated bars
 */

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { GlassCard } from '../ui/GlassCard'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { ageBucketColor, genderColor, formatPercent } from '../../config/theme'

export const DemographicsPanel: React.FC = () => {
  const { globalData } = useAnalyticsStore()
  const cardRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        scale: 0.96,
        opacity: 0,
        duration: 0.35,
        delay: 0.1,
        ease: 'power2.out',
      })
    }
  }, [])

  // Animate bars on data change
  useEffect(() => {
    barsRef.current.forEach((bar, key) => {
      gsap.to(bar, {
        scaleX: 1,
        duration: 0.5,
        ease: 'power2.out',
      })
    })
  }, [globalData])

  if (!globalData) {
    return null
  }

  const { gender, ages } = globalData.demographics
  const totalGender = gender.male + gender.female + gender.unknown
  const totalAge =
    ages.child + ages.young + ages.adult + ages.mature + ages.senior

  const genderData = [
    {
      key: 'male',
      label: 'Male',
      value: gender.male,
      color: genderColor('male'),
    },
    {
      key: 'female',
      label: 'Female',
      value: gender.female,
      color: genderColor('female'),
    },
    {
      key: 'unknown',
      label: 'Unknown',
      value: gender.unknown,
      color: genderColor('unknown'),
    },
  ]

  const ageData = [
    {
      key: 'child',
      label: 'Child (0-17)',
      value: ages.child,
      color: ageBucketColor('child'),
    },
    {
      key: 'young',
      label: 'Young (18-35)',
      value: ages.young,
      color: ageBucketColor('young'),
    },
    {
      key: 'adult',
      label: 'Adult (36-50)',
      value: ages.adult,
      color: ageBucketColor('adult'),
    },
    {
      key: 'mature',
      label: 'Mature (51-70)',
      value: ages.mature,
      color: ageBucketColor('mature'),
    },
    {
      key: 'senior',
      label: 'Senior (70+)',
      value: ages.senior,
      color: ageBucketColor('senior'),
    },
  ]

  const renderBar = (item: (typeof genderData)[0], total: number) => {
    const percent = total > 0 ? (item.value / total) * 100 : 0

    return (
      <div key={item.key} className="mb-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-300">{item.label}</span>
          </div>
          <span className="font-medium text-white">
            {item.value}{' '}
            <span className="text-gray-500">
              ({formatPercent(item.value, total)})
            </span>
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/5">
          <div
            ref={(el) => el && barsRef.current.set(item.key, el)}
            className="h-full origin-left rounded-full"
            style={{
              width: `${percent}%`,
              backgroundColor: item.color,
              boxShadow: `0 0 12px ${item.color}40`,
              transform: 'scaleX(0)',
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <GlassCard ref={cardRef} className="p-6">
      <h3 className="mb-6 text-lg font-semibold text-white">Demographics</h3>

      {/* Gender Distribution */}
      <div className="mb-8">
        <div className="mb-3 text-sm font-medium text-gray-400">
          Gender Distribution
        </div>
        {genderData.map((item) => renderBar(item, totalGender))}
      </div>

      {/* Age Distribution */}
      <div>
        <div className="mb-3 text-sm font-medium text-gray-400">
          Age Distribution
        </div>
        {ageData.map((item) => renderBar(item, totalAge))}
      </div>
    </GlassCard>
  )
}
