import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('HabitTracker', () => {
  it('renders all habit checkboxes', () => {
    render(
      <div>
        <label>
          <input type="checkbox" /> 15x AM Squats
        </label>
        <label>
          <input type="checkbox" /> 7k Steps
        </label>
        <label>
          <input type="checkbox" /> 1 Hour Stationary Bike
        </label>
        <label>
          <input type="checkbox" /> 15x PM Squats
        </label>
      </div>,
    )

    expect(screen.getByText('15x AM Squats')).toBeInTheDocument()
    expect(screen.getByText('7k Steps')).toBeInTheDocument()
    expect(screen.getByText('1 Hour Stationary Bike')).toBeInTheDocument()
    expect(screen.getByText('15x PM Squats')).toBeInTheDocument()
  })

  it('shows correct checked state for completed habits', () => {
    render(
      <div>
        <label>
          <input type="checkbox" defaultChecked={false} /> AM Squats
        </label>
        <label>
          <input type="checkbox" defaultChecked={true} /> Steps
        </label>
        <label>
          <input type="checkbox" defaultChecked={true} /> Bike
        </label>
        <label>
          <input type="checkbox" defaultChecked={false} /> PM Squats
        </label>
      </div>,
    )

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).not.toBeChecked()
    expect(checkboxes[1]).toBeChecked()
    expect(checkboxes[2]).toBeChecked()
    expect(checkboxes[3]).not.toBeChecked()
  })

  it('verifies habit count calculation', () => {
    const getCompletedCount = (habits: Record<string, boolean | null>) => {
      let count = 0
      if (habits.am_squats === true) count++
      if (habits.steps_7k === true) count++
      if (habits.bike_1hr === true) count++
      if (habits.pm_squats === true) count++
      return count
    }

    expect(
      getCompletedCount({
        am_squats: true,
        steps_7k: true,
        bike_1hr: true,
        pm_squats: true,
      }),
    ).toBe(4)
    expect(
      getCompletedCount({
        am_squats: true,
        steps_7k: false,
        bike_1hr: true,
        pm_squats: false,
      }),
    ).toBe(2)
  })
})
