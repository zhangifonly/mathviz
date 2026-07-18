import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { lucasNumbersNarration } from '../../narrations/scripts/lucas-numbers'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { TERMS, PHI } from './lucasNumbers'
import { drawLucasNumbers } from './draw'

const W = 600
const H = 480

export default function LucasNumbersExperiment() {
  const [terms, setTerms] = useState(12)
  const [showFib, setShowFib] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(lucasNumbersNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawLucasNumbers(canvas, terms, showFib)
  }, [terms, showFib])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">卢卡斯数</h1>
            <p className="text-gray-600">斐波那契的孪生数列</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">前 {terms} 项 · 相邻比趋于 φ≈{PHI.toFixed(4)}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">显示项数</h3>
              <div className="space-y-2">
                {TERMS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setTerms(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${terms === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    前 {n} 项
                  </button>
                ))}
              </div>
              <button onClick={() => setShowFib((v) => !v)} className={`w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium ${showFib ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>
                {showFib ? '✓ 已叠加斐波那契比' : '叠加斐波那契比对比'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">关于卢卡斯数</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 初值 <b>L0=2, L1=1</b>，递推同斐波那契：Lₙ=Lₙ₋₁+Lₙ₋₂。</li>
                <li>• 数列为 2, 1, 3, 4, 7, 11, 18, 29, 47…</li>
                <li>• 相邻项之比同样收敛到黄金比 <b>φ</b>。</li>
                <li>• 与斐波那契的桥梁：<b>Lₙ = Fₙ₋₁ + Fₙ₊₁</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
