import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { convex } from '../lib/convex'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/history')({
  loader: async () => {
    if (!convex) return { logs: [], exercises: [] }
    const logs = await convex.query(api.workoutLogs.getWorkoutLogs)
    const exercises = Array.from(new Set(logs.map((l: any) => l.exerciseName)))
    return { logs, exercises }
  },
  component: HistoryPage,
})

function HistoryPage() {
  const { logs, exercises } = Route.useLoaderData() as { logs: any[], exercises: string[] }
  const navigate = useNavigate()

  const [selectedExercise, setSelectedExercise] = useState(
    exercises.find((e) => e.includes('Leg Press')) || exercises[0] || '',
  )

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => l.exerciseName === selectedExercise)
  }, [logs, selectedExercise])

  const chartData = useMemo(() => {
    const dailyMax = filteredLogs.reduce((acc: any, curr) => {
      const existing = acc.find((item: any) => item.date === curr.date)
      if (existing) {
        if (curr.weight > existing.weight) {
          existing.weight = curr.weight
          existing.reps = curr.reps
        }
      } else {
        acc.push({ date: curr.date, weight: curr.weight, reps: curr.reps })
      }
      return acc
    }, [])
    return dailyMax
  }, [filteredLogs])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8 pb-24 font-sans flex justify-center">
      <div className="bg-white p-4 shadow-sm border-b sticky top-0 z-10 flex items-center gap-4 rounded-t-xl">
        <button
          onClick={() => navigate({ to: '/' })}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="font-bold text-xl text-gray-900">Progress Tracker</h1>
      </div>

      <div className="p-4 max-w-2xl w-full space-y-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
            Select Exercise
          </label>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {exercises.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 h-80">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-gray-700">Strength Curve</h2>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(str) => str.slice(5)}
                  stroke="#9ca3af"
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: any) => [`${value} lbs`, 'Weight']}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: '#10b981',
                    strokeWidth: 2,
                    stroke: '#fff',
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              No data logged for this exercise yet.
            </div>
          )}
        </div>

        {chartData.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <div className="text-blue-600 text-xs font-bold uppercase mb-1">
                Max Weight
              </div>
              <div className="text-2xl font-black text-blue-900">
                {Math.max(...chartData.map((d: any) => d.weight))}{' '}
                <span className="text-sm font-medium">lbs</span>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
              <div className="text-purple-600 text-xs font-bold uppercase mb-1">
                Total Sets
              </div>
              <div className="text-2xl font-black text-purple-900">
                {filteredLogs.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
