import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { bisectionMethodNarration } from '../../narrations/scripts/bisection-method'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { bisection, FUNCTIONS } from './bisectionMethod'
import { drawBisectionMethod } from './draw'

const W = 600
const H = 480

export default function BisectionMethodExperiment() {
  const [funcId, setFuncId] = useState(FUNCTIONS[0].id)
  const [step, setStep] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(bisectionMethodNarration)
  }, [narration])

  const func = FUNCTIONS.find((f) => f.id === funcId) ?? FUNCTIONS[0]
  const steps = bisection(func.fn, func.a, func.b, 1e-9, 40)
  const maxStep = steps.length - 1
  const cur = Math.min(step, maxStep)
  const s = steps[cur]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawBisectionMethod(canvas, func, cur)
  }, [func, cur])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">二分法求根</h1>
            <p className="text-gray-600">对半缩小含根区间</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">第 {cur} 次二分 · 区间宽度 {s.width.toExponential(2)}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择函数</h3>
              <div className="space-y-2">
                {FUNCTIONS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { setFuncId(f.id); setStep(0) }}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-left ${funcId === f.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">单步二分</h3>
              <div className="flex gap-2">
                <button onClick={() => setStep((v) => Math.max(0, v - 1))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">上一步</button>
                <button onClick={() => setStep((v) => Math.min(maxStep, v + 1))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">下一步 ▶</button>
              </div>
              <button onClick={() => setStep(0)} className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">重置</button>
              <p className="text-xs text-gray-500 mt-3">中点 mid = {s.mid.toFixed(6)}，f(mid) = {s.fMid.toExponential(2)}，真实根 ≈ {func.root.toFixed(6)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 两端<b>异号</b>，由<b>介值定理</b>区间内必有根。</li>
                <li>• 每步取中点判符号，含根区间<b>减半</b>。</li>
                <li>• 收敛是<b>线性</b>的：每次多稳定约 1 个二进制位。</li>
                <li>• 慢但极稳，只要初始异号就一定收敛。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
