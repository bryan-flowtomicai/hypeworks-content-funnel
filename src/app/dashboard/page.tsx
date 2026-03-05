'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth/signin')
        return
      }

      setUser(session.user)

      // Fetch user submissions
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (!error) {
        setSubmissions(data || [])
      }

      setLoading(false)
    }

    getSession()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Hypeworks</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
        >
          Sign Out
        </button>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome, {user?.email}
          </h2>
          <p className="text-slate-400">
            Manage your A+ content submissions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Total Submissions</p>
            <p className="text-3xl font-bold text-white">{submissions.length}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Completed</p>
            <p className="text-3xl font-bold text-green-400">
              {submissions.filter((s) => s.status === 'completed').length}
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Processing</p>
            <p className="text-3xl font-bold text-yellow-400">
              {submissions.filter((s) => s.status === 'processing').length}
            </p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <Link href="/dashboard/create">
            <Button>Create New Submission</Button>
          </Link>
        </div>

        {/* Submissions List */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">Your Submissions</h3>
          </div>

          {submissions.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-400">
              <p>No submissions yet. Create your first one!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="px-6 py-4 flex justify-between items-center hover:bg-slate-700/50 transition"
                >
                  <div>
                    <p className="text-white font-medium">{submission.product_url}</p>
                    <p className="text-slate-400 text-sm">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        submission.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : submission.status === 'processing'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {submission.status.charAt(0).toUpperCase() +
                        submission.status.slice(1)}
                    </span>
                    <Link href={`/dashboard/submission/${submission.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
