import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { polynomialRootsNarration } from '../../narrations/scripts/polynomial-roots'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { findRealRoots, degree, SAMPLE_POLYS } from './polynomialRoots'
import { drawPolynomialRoots } from './draw'

const W = 600
const H = 480

export default function PolynomialRootsExperiment() {
  const [coeffs, setCoeffs] = useState<number[]>(SAMPLE_POLYS[1].coeffs)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(polynomialRootsNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPolynomialRoots(canvas, coeffs)
  }, [coeffs])

  const roots = findRealRoots(coeffs)
  const n = degree(coeffs)
  const labels = ['a₀', 'a₁', 'a₂', 'a₃', 'a₄']

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">多项式求根</h1>
            <p className="text-gray-600">实根复根与系数</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{n} 次多项式 · {roots.length} 个实根</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">示例多项式</h3>
              <div className="space-y-2">
                {SAMPLE_POLYS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setCoeffs(p.coeffs)}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium text-left bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">调整系数看根移动</h3>
              <div className="space-y-2">
                {coeffs.map((c, i) => (
                  <label key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-8">{labels[i]}</span>
                    <input
                      type="range" min={-5} max={5} step={0.5} value={c}
                      onChange={(e) => {
                        const next = [...coeffs]
                        next[i] = Number(e.target.value)
                        setCoeffs(next)
                      }}
                      className="flex-1"
                    />
                    <span className="w-8 text-right tabular-nums">{c}</span>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                实根：{roots.length ? roots.map((r) => r.toFixed(2)).join(', ') : '无（可能都是复根）'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
