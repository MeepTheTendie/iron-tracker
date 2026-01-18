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
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
