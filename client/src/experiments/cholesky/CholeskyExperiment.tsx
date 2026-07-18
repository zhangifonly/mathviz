import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { choleskyNarration } from '../../narrations/scripts/cholesky'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLE_MATRICES, choleskySteps } from './cholesky'
import { drawCholesky } from './draw'

const W = 600
const H = 480

export default function CholeskyExperiment() {
  const [idx, setIdx] = useState(0)
  const [step, setStep] = useState(999)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(choleskyNarration)
  }, [narration])

  const A = SAMPLE_MATRICES[idx]
  const total = choleskySteps(A).length
  const shown = Math.min(step, total)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawCholesky(canvas, A, shown)
  }, [A, shown])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Cholesky 分解</h1>
            <p className="text-gray-600">对称正定 = 下三角乘转置</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">A = L · Lᵀ · 逐元素分解</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择矩阵 A</h3>
              <div className="space-y-2">
                {SAMPLE_MATRICES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setIdx(i); setStep(999) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    正定矩阵 {i + 1}
                  </button>
                ))}
              </div>
              <label className="block text-sm text-gray-600 mt-4 mb-1">揭示进度 {shown}/{total}</label>
              <input
                type="range" min={0} max={total} value={shown}
                onChange={(e) => setStep(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <button onClick={() => setStep(999)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                一次看完整分解
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 只有<b>对称正定</b>矩阵才有 Cholesky 分解。</li>
                <li>• L 是对角为正的<b>下三角</b>矩阵，且唯一。</li>
                <li>• 对角元 Lⱼⱼ = √(Aⱼⱼ − ΣLⱼₖ²)，出现非正即非正定。</li>
                <li>• 计算量约为 LU 分解的<b>一半</b>，常用于解线性方程组与蒙特卡洛采样。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
