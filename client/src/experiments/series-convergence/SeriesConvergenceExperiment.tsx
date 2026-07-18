import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { seriesConvergenceNarration } from '../../narrations/scripts/series-convergence'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SERIES, N_COUNTS, ratioTest } from './seriesConvergence'
import { drawSeriesConvergence } from './draw'

const W = 600
const H = 480

const LIMITS: Record<string, number | undefined> = {
  geometric: 2,
  harmonic: undefined,
  p2: (Math.PI * Math.PI) / 6,
  alternating: Math.LN2,
}

export default function SeriesConvergenceExperiment() {
  const [key, setKey] = useState('geometric')
  const [N, setN] = useState(50)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(seriesConvergenceNarration)
  }, [narration])

  const def = SERIES.find((s) => s.key === key)!

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawSeriesConvergence(canvas, def.term, N, def.converges ? LIMITS[key] : undefined)
  }, [key, N, def])

  const L = ratioTest(def.term)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">级数收敛判别</h1>
            <p className="text-gray-600">无穷和何时有限</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{def.label} · {def.converges ? '收敛于 ' + def.limit : '发散'}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择级数</h3>
              <div className="space-y-2">
                {SERIES.map((s) => (
                  <button key={s.key} onClick={() => setKey(s.key)}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-left ${key === s.key ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">项数 N</h3>
              <div className="flex gap-2">
                {N_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setN(n)}
                    className={`flex-1 px-2 py-2 rounded-lg text-sm font-medium ${N === n ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">比值判别法</h3>
              <p className="text-sm text-gray-600 mb-2">lim |a<sub>n+1</sub>/a<sub>n</sub>| ≈ <b>{L.toFixed(3)}</b></p>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• L &lt; 1 收敛，L &gt; 1 发散，L = 1 失效。</li>
                <li>• 调和级数 L=1，需更细的 p 级数判别。</li>
                <li>• 收敛级数的部分和趋于水平渐近线。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
