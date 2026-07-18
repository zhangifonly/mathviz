import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { fixedPointIterationNarration } from '../../narrations/scripts/fixed-point-iteration'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FUNCTIONS, findFunc } from './fixedPointIteration'
import { drawFixedPointIteration } from './draw'

const W = 600
const H = 480
const MAX_STEPS = 20

export default function FixedPointIterationExperiment() {
  const [funcKey, setFuncKey] = useState('cos')
  const [steps, setSteps] = useState(6)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(fixedPointIterationNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const fn = findFunc(funcKey)
    const domain: [number, number] = funcKey === 'cos' ? [-0.5, 2] : [-0.5, 5.5]
    drawFixedPointIteration(canvas, fn, steps, domain)
  }, [funcKey, steps])

  const fn = findFunc(funcKey)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">不动点迭代</h1>
            <p className="text-gray-600">蛛网图与收敛</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">蛛网图 · {fn.converges ? '收敛' : '发散'} · 第 {steps} 步</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择函数</h3>
              <div className="space-y-2">
                {FUNCTIONS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => { setFuncKey(f.key); setSteps(6) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${funcKey === f.key ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <label className="block text-sm text-gray-600 mt-4 mb-1">迭代步数：{steps}</label>
              <input
                type="range" min={0} max={MAX_STEPS} value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 迭代 <b>x→g(x)</b>，极限满足 g(x*)=x*，即不动点。</li>
                <li>• 蛛网竖到曲线、横到对角线，反复逼近交点。</li>
                <li>• 收敛条件：不动点处 <b>|g'(x*)| &lt; 1</b>。</li>
                <li>• 斜率太陡（如 x²）时蛛网向外发散。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
