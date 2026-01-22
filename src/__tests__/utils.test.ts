import { describe, expect, it } from 'vitest'

describe('utils', () => {
  it('calculates progress percentage correctly', () => {
    const calculatePercent = (watched: number, total: number) => {
      if (total === 0) return 0
      return Math.round((watched / total) * 100)
    }

    expect(calculatePercent(5, 10)).toBe(50)
    expect(calculatePercent(10, 10)).toBe(100)
    expect(calculatePercent(0, 10)).toBe(0)
    expect(calculatePercent(0, 0)).toBe(0)
  })

  it('filters shows by franchise correctly', () => {
    const shows = [
      { id: '1', title: 'Kamen Rider Kuuga', franchise: 'rider' },
      { id: '2', title: 'Kamen Rider Agito', franchise: 'rider' },
      { id: '3', title: 'Super Sentai', franchise: 'sentai' },
    ]

    const filterByFranchise = (franchise: string) => {
      return shows.filter((s) => s.franchise === franchise)
    }

    expect(filterByFranchise('rider').length).toBe(2)
    expect(filterByFranchise('sentai').length).toBe(1)
    expect(filterByFranchise('metal').length).toBe(0)
  })

  it('groups items by key correctly', () => {
    const items = [
      { id: '1', era: 'Showa' },
      { id: '2', era: 'Heisei' },
      { id: '3', era: 'Showa' },
    ]

    const groupByKey = (key: keyof (typeof items)[0]) => {
      return items.reduce(
        (acc, item) => {
          const groupKey = String(item[key])

          if (!acc[groupKey]) {
            acc[groupKey] = []
          }
          acc[groupKey].push(item)
          return acc
        },
        {} as Record<string, typeof items>,
      )
    }

    const grouped = groupByKey('era')

    expect(Object.keys(grouped)).toEqual(['Showa', 'Heisei'])
    expect(grouped['Showa'].length).toBe(2)
    expect(grouped['Heisei'].length).toBe(1)
  })
})

describe('Date Utilities', () => {
  it('formats date as YYYY-MM-DD', () => {
    const date = new Date('2026-01-21T12:00:00Z')
    const dateStr = date.toISOString().split('T')[0]
    expect(dateStr).toBe('2026-01-21')
  })

  it('gets day name correctly', () => {
    const testCases = [
      { date: '2026-01-20', expected: 'Tuesday' },
      { date: '2026-01-21', expected: 'Wednesday' },
      { date: '2026-01-22', expected: 'Thursday' },
      { date: '2026-01-23', expected: 'Friday' },
      { date: '2026-01-24', expected: 'Saturday' },
      { date: '2026-01-25', expected: 'Sunday' },
      { date: '2026-01-26', expected: 'Monday' },
    ]

    testCases.forEach(({ date, expected }) => {
      const dayName = new Date(`${date}T12:00:00Z`).toLocaleDateString(
        'en-US',
        {
          weekday: 'long',
        },
      )
      expect(dayName).toBe(expected)
    })
  })
})

describe('Workout Calculations', () => {
  it('calculates total volume correctly', () => {
    const sets = [
      { weight: 135, reps: 10 },
      { weight: 135, reps: 8 },
      { weight: 155, reps: 5 },
    ]

    const totalVolume = sets.reduce(
      (sum, set) => sum + set.weight * set.reps,
      0,
    )
    expect(totalVolume).toBe(3205)
  })

  it('calculates one rep max estimate', () => {
    const weight = 225
    const reps = 5
    const oneRepMax = Math.round(weight * (1 + reps / 30))
    expect(oneRepMax).toBe(263)
  })

  it('calculates strength improvement percentage', () => {
    const initialWeight = 135
    const currentWeight = 185
    const improvement = ((currentWeight - initialWeight) / initialWeight) * 100
    expect(improvement).toBeCloseTo(37.04, 1)
  })

  it('finds max weight from workout logs', () => {
    const logs = [
      { date: '2026-01-15', weight: 135, reps: 10 },
      { date: '2026-01-18', weight: 155, reps: 8 },
      { date: '2026-01-21', weight: 185, reps: 5 },
    ]

    const maxWeight = Math.max(...logs.map((log) => log.weight))
    expect(maxWeight).toBe(185)
  })
})

describe('Streak Calculations', () => {
  it('calculates consecutive days streak', () => {
    const habitHistory = [
      { date: '2026-01-21', completed: true },
      { date: '2026-01-20', completed: true },
      { date: '2026-01-19', completed: true },
      { date: '2026-01-18', completed: false },
      { date: '2026-01-17', completed: true },
    ]

    let streak = 0
    for (const entry of habitHistory) {
      if (entry.completed) {
        streak++
      } else {
        break
      }
    }
    expect(streak).toBe(3)
  })

  it('returns 0 for no completed days', () => {
    const habitHistory = [
      { date: '2026-01-21', completed: false },
      { date: '2026-01-20', completed: false },
    ]

    let streak = 0
    for (const entry of habitHistory) {
      if (entry.completed) {
        streak++
      } else {
        break
      }
    }
    expect(streak).toBe(0)
  })
})

describe('Validation', () => {
  it('validates positive numbers', () => {
    const isValidPositive = (num: number) => num > 0
    expect(isValidPositive(100)).toBe(true)
    expect(isValidPositive(0)).toBe(false)
    expect(isValidPositive(-10)).toBe(false)
  })

  it('validates exercise name not empty', () => {
    const isValidName = (name: string) => name.trim().length > 0
    expect(isValidName('Bench Press')).toBe(true)
    expect(isValidName('  ')).toBe(false)
    expect(isValidName('')).toBe(false)
  })

  it('validates reps within range', () => {
    const isValidReps = (reps: number) => reps >= 1 && reps <= 100
    expect(isValidReps(10)).toBe(true)
    expect(isValidReps(1)).toBe(true)
    expect(isValidReps(100)).toBe(true)
    expect(isValidReps(0)).toBe(false)
    expect(isValidReps(101)).toBe(false)
  })
})

describe('String Helpers', () => {
  it('capitalizes first letter', () => {
    const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1)
    expect(capitalize('bench press')).toBe('Bench press')
    expect(capitalize('BENCH')).toBe('BENCH')
    expect(capitalize('')).toBe('')
  })

  it('trims and normalizes whitespace', () => {
    const normalize = (str: string) => str.replace(/\s+/g, ' ').trim()
    expect(normalize('Bench   Press')).toBe('Bench Press')
    expect(normalize('  Bench  Press  ')).toBe('Bench Press')
  })
})
