import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { piecewiseFunctionNarration } from '../../narrations/scripts/piecewise-function'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLES, checkContinuity } from './piecewiseFunction'
import { drawPiecewiseFunction } from './draw'

const W = 600
const H = 480

export default function PiecewiseFunctionExperiment() {
  const [idx, setIdx] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(piecewiseFunctionNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPiecewiseFunction(canvas, SAMPLES[idx])
  }, [idx])

  const def = SAMPLES[idx]
  const results = def.breakpoints.map((b) => checkContinuity(def, b))

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">分段函数</h1>
            <p className="text-gray-600">连续与间断</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{def.name}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择例子</h3>
              <div className="space-y-2">
                {SAMPLES.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => setIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">分段点连续性</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                {results.map((r) => (
                  <li key={r.breakpoint}>
                    • x = {r.breakpoint}：{r.kind === 'continuous'
                      ? <b className="text-emerald-600">连续</b>
                      : <span><b className="text-orange-600">跳跃间断</b>（跳跃量 {r.jump.toFixed(1)}）</span>}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 mt-3">实心点表示取到该值，空心圈表示极限值但不取到。</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
