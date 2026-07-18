import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { hypothesisTestingNarration } from '../../narrations/scripts/hypothesis-testing'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { runTest, ALPHAS } from './hypothesisTesting'
import { drawHypothesisTesting } from './draw'

const W = 600
const H = 480
const MU0 = 100
const SIGMA = 15
const N = 30

export default function HypothesisTestingExperiment() {
  const [mean, setMean] = useState(106)
  const [alpha, setAlpha] = useState(0.05)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(hypothesisTestingNarration)
  }, [narration])

  const result = runTest(mean, MU0, SIGMA, N, alpha)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawHypothesisTesting(canvas, runTest(mean, MU0, SIGMA, N, alpha), alpha)
  }, [mean, alpha])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">假设检验</h1>
            <p className="text-gray-600">用数据判断原假设</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">标准正态曲线 · 拒绝域与 p 值</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">样本均值 x̄ = {mean}</h3>
              <input
                type="range" min={92} max={112} step={0.5} value={mean}
                onChange={(e) => setMean(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <p className="text-sm text-gray-500 mt-1">H0: μ = {MU0} · σ = {SIGMA} · n = {N}</p>
              <h3 className="text-lg font-semibold mb-2 mt-4">显著性水平 α</h3>
              <div className="flex gap-2">
                {ALPHAS.map((a) => (
                  <button
                    key={a} onClick={() => setAlpha(a)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${alpha === a ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">检验结果</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 检验统计量 <b>z = {result.z.toFixed(3)}</b></li>
                <li>• 双侧 <b>p 值 = {result.p.toFixed(4)}</b></li>
                <li>• 临界值 <b>±{result.zCrit.toFixed(3)}</b></li>
                <li className={result.reject ? 'text-red-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                  • {result.reject ? '拒绝原假设 H0（差异显著）' : '不拒绝原假设 H0'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
