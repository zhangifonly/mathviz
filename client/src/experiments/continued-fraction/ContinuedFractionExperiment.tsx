import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { continuedFractionNarration } from '../../narrations/scripts/continued-fraction'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import {
  continuedFractionCoeffs,
  convergents,
  NUMBER_OPTIONS,
} from './continuedFraction'
import { drawContinuedFraction } from './draw'
import type { ContinuedFractionData } from './draw'

export default function ContinuedFractionExperiment() {
  const [key, setKey] = useState('pi')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(continuedFractionNarration)
  }, [narration])

  const option = NUMBER_OPTIONS.find((o) => o.key === key)!

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const coeffs = continuedFractionCoeffs(option.value, 12)
    const data: ContinuedFractionData = {
      value: option.value,
      label: option.label.replace(/^[^ ]* /, '') || option.label,
      coeffs,
      convergents: convergents(coeffs),
    }
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.015)
      drawContinuedFraction(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [option])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">连分数</h1>
            <p className="text-gray-600">用无穷嵌套的分数逼近每一个实数</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{option.label} 的连分数展开与渐近分数收敛</h3>
            <canvas ref={canvasRef} width={600} height={560} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择一个数</h3>
              <div className="space-y-2">
                {NUMBER_OPTIONS.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => setKey(o.key)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${key === o.key ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${key === o.key ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">连分数趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 任何实数都能写成 a0 加 1 除以（a1 加 1 除以（a2 加 ...））的<b>嵌套分数</b>。</li>
                <li>• 截断得到的<b>渐近分数</b>是同等分母下最精确的有理逼近。</li>
                <li>• 圆周率的渐近分数给出了<b>22/7</b> 和精度惊人的 <b>355/113</b>。</li>
                <li>• 黄金比例的系数<b>全是 1</b>，因此它是最难被有理数逼近的数。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
