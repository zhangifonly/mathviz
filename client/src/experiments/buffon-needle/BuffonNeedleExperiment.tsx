import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { buffonNeedleNarration } from '../../narrations/scripts/buffon-needle'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { simulate, NEEDLE_COUNTS } from './buffonNeedle'
import { drawBuffonNeedle } from './draw'

const W = 600
const H = 480

export default function BuffonNeedleExperiment() {
  const [count, setCount] = useState(1000)
  const [seed, setSeed] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(buffonNeedleNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawBuffonNeedle(canvas, count, seed, true)
  }, [count, seed])

  const result = simulate(count, seed, W, H, 60, 60)
  const est = Number.isNaN(result.piEstimate) ? '—' : result.piEstimate.toFixed(5)
  const err = Number.isNaN(result.piEstimate)
    ? '—'
    : (Math.abs(result.piEstimate - Math.PI) / Math.PI * 100).toFixed(2) + '%'

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">蒲丰投针</h1>
            <p className="text-gray-600">投针估计圆周率</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{count} 根针 · 相交 {result.crossings} 根</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">投针数量</h3>
              <div className="space-y-2">
                {NEEDLE_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${count === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n} 根针
                  </button>
                ))}
              </div>
              <button onClick={() => setSeed((s) => s + 1)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🎲 重新投一次
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">估计结果</h3>
              <p className="text-sm text-gray-600">π 估计值：<b className="text-indigo-600">{est}</b></p>
              <p className="text-sm text-gray-600">真值 π ≈ 3.14159，误差 {err}</p>
              <ul className="text-sm text-gray-600 space-y-1.5 mt-3">
                <li>• 针长=线距时，相交概率 P=<b>2/π</b>。</li>
                <li>• 由频率反推：π≈<b>2n/相交数</b>。</li>
                <li>• 投得越多，估计越稳定收敛。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
