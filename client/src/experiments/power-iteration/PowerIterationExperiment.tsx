import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { powerIterationNarration } from '../../narrations/scripts/power-iteration'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { powerIteration, SAMPLE_MATRICES } from './powerIteration'
import { drawPowerIteration } from './draw'

const W = 600
const H = 480
const ITERS = 24
const V0: [number, number] = [1, 0]

export default function PowerIterationExperiment() {
  const [mi, setMi] = useState(0)
  const [step, setStep] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(powerIterationNarration)
  }, [narration])

  const matrix = SAMPLE_MATRICES[mi].matrix
  const steps = powerIteration(matrix, V0, ITERS)
  const shown = Math.min(step, steps.length - 1)
  const cur = steps[shown]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPowerIteration(canvas, matrix, V0, shown, ITERS)
  }, [matrix, shown])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">幂迭代</h1>
            <p className="text-gray-600">反复乘矩阵求主特征向量</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">第 {shown} 步 · 主特征值估计 λ ≈ {cur.eigenvalue.toFixed(4)}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择矩阵</h3>
              <div className="space-y-2">
                {SAMPLE_MATRICES.map((m, i) => (
                  <button
                    key={m.name}
                    onClick={() => { setMi(i); setStep(0) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${mi === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {m.name} [{m.matrix.join(', ')}]
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">单步迭代</h3>
              <div className="flex gap-2">
                <button onClick={() => setStep((s) => Math.max(0, s - 1))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">上一步</button>
                <button onClick={() => setStep((s) => Math.min(ITERS, s + 1))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200">下一步</button>
              </div>
              <button onClick={() => setStep(0)} className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                ↺ 重置
              </button>
              <p className="mt-3 text-xs text-gray-500">v = ({cur.vector[0].toFixed(3)}, {cur.vector[1].toFixed(3)})</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理速览</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 每步做 v ← Av/|Av|，方向逐步锁定<b>主特征向量</b>。</li>
                <li>• 主特征值绝对值越大，收敛<b>越快</b>。</li>
                <li>• 瑞利商 (v·Av)/(v·v) 给出特征值估计。</li>
                <li>• 谷歌 PageRank 就是超大规模的幂迭代。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
