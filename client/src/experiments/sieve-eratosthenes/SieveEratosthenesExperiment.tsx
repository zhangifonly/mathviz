import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { sieveEratosthenesNarration } from '../../narrations/scripts/sieve-eratosthenes'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { GRID_SIZES, countPrimes } from './sieveEratosthenes'
import { drawSieveEratosthenes } from './draw'

const W = 600
const H = 480

export default function SieveEratosthenesExperiment() {
  const [n, setN] = useState(100)
  const [reveal, setReveal] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(sieveEratosthenesNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawSieveEratosthenes(canvas, n, 10, reveal)
  }, [n, reveal])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">埃氏筛法</h1>
            <p className="text-gray-600">古老而优雅的素数筛选</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">0 到 {n} · 共 {countPrimes(n)} 个素数</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">上界</h3>
              <div className="space-y-2">
                {GRID_SIZES.map((g) => (
                  <button
                    key={g}
                    onClick={() => { setN(g); setReveal(0) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${n === g ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    筛到 {g}
                  </button>
                ))}
              </div>
              <button onClick={() => setReveal((r) => (r < 2 ? 2 : r + 1))} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-amber-100 text-amber-700 hover:bg-amber-200">
                ▶ 单步筛除倍数
              </button>
              <button onClick={() => setReveal(0)} className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                ↺ 显示全部
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">看点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 金色格子是<b>素数</b>，其余按<b>最小质因子</b>着色。</li>
                <li>• 从 2 起，逐个把素数的倍数标记为合数。</li>
                <li>• 越往后素数越<b>稀疏</b>，这正是素数定理的直观体现。</li>
                <li>• 只需筛到 √n，剩下的自然都是素数。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
