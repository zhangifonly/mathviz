import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { secantMethodNarration } from '../../narrations/scripts/secant-method'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { secant, finalEstimate, FUNCTIONS } from './secantMethod'
import { drawSecantMethod } from './draw'

const W = 600
const H = 480
const MAX_STEP = 8

export default function SecantMethodExperiment() {
  const [fnIdx, setFnIdx] = useState(0)
  const [step, setStep] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(secantMethodNarration)
  }, [narration])

  const entry = FUNCTIONS[fnIdx]
  const shownStep = Math.min(step, MAX_STEP)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawSecantMethod(canvas, entry.fn, entry.x0, entry.x1, shownStep)
  }, [entry, shownStep])

  const steps = secant(entry.fn, entry.x0, entry.x1, shownStep)
  const est = finalEstimate(steps, entry.x1)
  const err = Math.abs(est - entry.root)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">割线法</h1>
            <p className="text-gray-600">无需导数的求根</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">f(x) = {entry.label} · 第 {shownStep} 步</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择方程</h3>
              <div className="space-y-2">
                {FUNCTIONS.map((f, i) => (
                  <button
                    key={f.key}
                    onClick={() => { setFnIdx(i); setStep(1) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${fnIdx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {f.label} = 0
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setStep((s) => Math.max(s - 1, 1))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">上一步</button>
                <button onClick={() => setStep((s) => Math.min(s + 1, MAX_STEP))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">单步 →</button>
              </div>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <div>当前估计 x ≈ <b>{est.toFixed(6)}</b></div>
                <div>误差 |x - 根| ≈ <b>{err.toExponential(2)}</b></div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 用最近两点的<b>割线</b>代替切线，免去求导。</li>
                <li>• 割线与 x 轴的交点，就是下一个估计值。</li>
                <li>• 收敛阶约 <b>1.618</b>（黄金比例），超线性收敛。</li>
                <li>• 广泛用于工程中导数难求的方程求根。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
