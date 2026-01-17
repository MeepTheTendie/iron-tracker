import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Dumbbell, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/exercises')({
  loader: async () => {
    const { data: exercises } = await supabase
      .from('exercises')
      .select('*')
      .order('name')

    return { exercises: exercises || [] }
  },
  component: ExercisesPage,
})

type Exercise = {
  id: number
  name: string
  muscle_group: string | null
  notes: string | null
}

function ExercisesPage() {
  const { exercises } = Route.useLoaderData()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    muscle_group: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { error } = await supabase.from('exercises').insert({
      name: formData.name,
      muscle_group: formData.muscle_group || null,
      notes: formData.notes || null,
    })

    if (error) {
      alert('Failed to add exercise: ' + error.message)
    } else {
      setFormData({ name: '', muscle_group: '', notes: '' })
      setShowForm(false)
      navigate({ to: '/exercises' }) // Refresh the page
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this exercise?')) return

    const { error } = await supabase.from('exercises').delete().eq('id', id)
    if (error) {
      alert('Failed to delete: ' + error.message)
    } else {
      navigate({ to: '/exercises' }) // Refresh the page
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8 pb-24 font-sans flex justify-center">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b sticky top-0 z-10 flex items-center gap-4 rounded-t-xl">
        <button
          onClick={() => navigate({ to: '/' })}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="font-bold text-xl text-gray-900">Exercise Library</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="ml-auto bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      <div className="p-4 max-w-2xl w-full space-y-4">
        {/* Add Exercise Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 space-y-4"
          >
            <h2 className="font-bold text-gray-800">Add New Exercise</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exercise Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Barbell Row"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Muscle Group
              </label>
              <input
                type="text"
                value={formData.muscle_group}
                onChange={(e) =>
                  setFormData({ ...formData, muscle_group: e.target.value })
                }
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Back, Chest, Legs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={2}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Form tips, common mistakes, etc."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Exercise'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Exercise List */}
        {exercises.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No exercises yet. Add your first one!
          </div>
        ) : (
          exercises.map((exercise: Exercise) => (
            <div
              key={exercise.id}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-xl">
                    <Dumbbell className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{exercise.name}</h3>
                    {exercise.muscle_group && (
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {exercise.muscle_group}
                      </span>
                    )}
                    {exercise.notes && (
                      <p className="text-sm text-gray-600 mt-1">
                        {exercise.notes}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(exercise.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
