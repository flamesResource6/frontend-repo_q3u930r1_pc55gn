import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'

function Header() {
  return (
    <div className="text-center space-y-3">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
        Simple Intake
      </h1>
      <p className="text-blue-200/80 text-sm md:text-base">
        Enter your details and watch the smooth loading experience
      </p>
    </div>
  )
}

function FormView({ onSubmit }) {
  const [firstName, setFirstName] = useState('')
  const [dob, setDob] = useState('')

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-800/60 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 md:p-8 shadow-xl">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit({ firstName: firstName.trim(), dob })
        }}
      >
        <div className="grid grid-cols-1 gap-6">
          <label className="block">
            <span className="block text-sm font-medium text-blue-100 mb-2">First name</span>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
              className="w-full rounded-xl bg-slate-900/60 border border-slate-700/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-400 px-4 py-3 outline-none transition"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-blue-100 mb-2">Date of birth</span>
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-xl bg-slate-900/60 border border-slate-700/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 text-white px-4 py-3 outline-none transition [color-scheme:dark]"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-medium px-5 py-3 transition shadow-lg shadow-blue-600/20"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

function LoadingView({ firstName, onComplete }) {
  const [progress, setProgress] = useState(0)

  const stages = useMemo(() => (
    [
      { until: 25, label: `Validating ${firstName ? firstName + "'s" : 'your'} info` },
      { until: 50, label: 'Securing connection' },
      { until: 75, label: 'Processing data' },
      { until: 95, label: 'Final checks' },
      { until: 100, label: 'Wrapping up' },
    ]
  ), [firstName])

  const status = useMemo(() => {
    for (const s of stages) if (progress <= s.until) return s.label
    return stages[stages.length - 1].label
  }, [progress, stages])

  useEffect(() => {
    const totalMs = 3200
    const steps = 100
    const interval = totalMs / steps
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100
        return p + 1
      })
    }, interval)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => onComplete(), 500)
      return () => clearTimeout(t)
    }
  }, [progress, onComplete])

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-blue-500/20 shadow-xl bg-slate-900/60">
        <Spline
          scene="https://prod.spline.design/igThmltzmqv5hkWo/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
        {/* Gradient overlay for readability (non-blocking) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

        {/* Status content */}
        <div className="absolute inset-0 flex items-end p-6">
          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-blue-100/90 text-sm md:text-base">{status}</span>
              <span className="text-blue-100/90 font-medium tabular-nums">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300 transition-[width] duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <p className="text-center mt-4 text-blue-200/70 text-sm">Interactive loading animation</p>
    </div>
  )
}

function CompleteView() {
  return (
    <div className="text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/20 border border-green-400/30 shadow-lg shadow-green-500/10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="w-9 h-9 text-green-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h2 className="text-3xl md:text-4xl font-semibold text-white">Complete</h2>
      <p className="text-blue-200/80">All done. You can close this window or go back.</p>
    </div>
  )
}

export default function App() {
  const [phase, setPhase] = useState('form') // form | loading | done
  const [firstName, setFirstName] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
      {/* Subtle radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(40rem_40rem_at_50%_-10rem,rgba(59,130,246,0.15),transparent)]" />

      <div className="relative max-w-6xl mx-auto px-6 py-14 md:py-20 space-y-10">
        <Header />

        {phase === 'form' && (
          <FormView
            onSubmit={({ firstName, dob }) => {
              setFirstName(firstName)
              // dob is not used further but would be sent to backend in a real app
              setPhase('loading')
            }}
          />
        )}

        {phase === 'loading' && (
          <LoadingView firstName={firstName} onComplete={() => setPhase('done')} />
        )}

        {phase === 'done' && <CompleteView />}

        {/* Footer note */}
        <div className="text-center pt-4">
          <p className="text-xs text-blue-300/50">Built with a modern, minimalist loading aesthetic</p>
        </div>
      </div>
    </div>
  )
}
