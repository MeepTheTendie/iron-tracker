import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { trackEvent, trackPageView } from '../lib/analytics'
import { DB_NAME, DB_VERSION, HABIT_STORE } from '../lib/offlineStorage'
import type { PendingHabit } from '../lib/offlineStorage'

describe('lib/analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete (window as any).gtag
    delete (window as any).dataLayer
  })

  afterEach(() => {
    delete (window as any).gtag
    delete (window as any).dataLayer
  })

  it('trackEvent does nothing when gtag is not defined', () => {
    expect(() => trackEvent('test', 'category')).not.toThrow()
  })

  it('trackEvent calls gtag when defined', () => {
    ;(window as any).gtag = vi.fn()
    trackEvent('test_action', 'test_category', 'test_label', 1)
    expect((window as any).gtag).toHaveBeenCalledWith('event', 'test_action', {
      event_category: 'test_category',
      event_label: 'test_label',
      value: 1,
    })
  })

  it('trackPageView does nothing when gtag is not defined', () => {
    expect(() => trackPageView('/test')).not.toThrow()
  })

  it('trackPageView calls gtag when defined', () => {
    ;(window as any).gtag = vi.fn()
    trackPageView('/dashboard')
    expect((window as any).gtag).toHaveBeenCalled()
  })
})

describe('lib/offlineStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('PendingHabit interface is properly defined', () => {
    const habit: PendingHabit = {
      date: '2026-01-21',
      field: 'amSquats',
      value: true,
      createdAt: Date.now(),
    }
    expect(habit.date).toBe('2026-01-21')
    expect(habit.field).toBe('amSquats')
    expect(habit.value).toBe(true)
  })

  it('DB_NAME constant is defined', () => {
    expect(DB_NAME).toBe('iron-tracker-db')
  })

  it('DB_VERSION constant is defined', () => {
    expect(DB_VERSION).toBe(1)
  })

  it('HABIT_STORE constant is defined', () => {
    expect(HABIT_STORE).toBe('pending-habits')
  })
})
