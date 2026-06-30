import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { ulamSpiralNarration } from '../../narrations/scripts/ulam-spiral'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { ulamSpiral, countPrimes } from './ulam'
import { drawSpiral } from './draw'

const SIZES = [
  { count: 441, label: '21×21（441）' },
  { count: 961, label: '31×31（961）' },
  { count: 2601, label: '51×51（2601）' },
]

export default function UlamSpiralExperiment() {
  const [count, setCount] = useState(961)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(ulamSpiralNarration)
  }, [narration])

  const cells = ulamSpiral(count)
  const primes = countPrimes(cells)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const data = ulamSpiral(count)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawSpiral(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [count])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">素数螺旋</h1>
            <p className="text-gray-600">乌拉姆的随手涂鸦，揭开素数的神秘对角线</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">螺旋揭示动画 · 金色为素数</h3>
            <canvas ref={canvasRef} width={560} height={560} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">网格规模</h3>
              <div className="space-y-2">
                {SIZES.map((s) => (
                  <button
                    key={s.count}
                    onClick={() => setCount(s.count)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${count === s.count ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">统计</h3>
              <p className="text-sm text-gray-600">共 {count} 个数，其中素数 <b className="text-amber-500">{primes}</b> 个，占比 {(primes / count * 100).toFixed(1)}%。</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">素数趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 1963 年数学家乌拉姆在开会走神时随手画出了这个螺旋。</li>
                <li>• 素数竟然明显聚集在一些<b>对角线</b>上，而非均匀散布。</li>
                <li>• 这些对角线对应着能产生大量素数的<b>二次多项式</b>。</li>
                <li>• 素数分布至今仍是数学最深的未解之谜之一。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
