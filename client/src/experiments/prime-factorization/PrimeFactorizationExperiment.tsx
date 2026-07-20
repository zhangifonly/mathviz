import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { primeFactorizationNarration } from '../../narrations/scripts/prime-factorization'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLES, formatFactorization, factorPairs } from './primeFactorization'
import { drawPrimeFactorization } from './draw'

const W = 600
const H = 480

export default function PrimeFactorizationExperiment() {
  const [n, setN] = useState(60)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(primeFactorizationNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPrimeFactorization(canvas, n)
  }, [n])

  const pairs = factorPairs(n)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">质因数分解</h1>
            <p className="text-gray-600">算术基本定理</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{n} = {formatFactorization(n)}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择数字</h3>
              <div className="space-y-2">
                {SAMPLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setN(s)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${n === s ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    分解 {s}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={2}
                max={99999}
                value={n}
                onChange={(e) => {
                  const v = Math.trunc(Number(e.target.value))
                  if (Number.isFinite(v) && v >= 2 && v <= 99999) setN(v)
                }}
                className="w-full mt-3 px-3 py-2 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">指数形式</h3>
              <div className="flex flex-wrap gap-2 mb-3 text-sm">
                {pairs.map((p) => (
                  <span key={p.prime} className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-mono">
                    {p.prime}<sup>{p.exp}</sup>
                  </span>
                ))}
              </div>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 绿色圆点是<b>质数</b>，无法再拆分。</li>
                <li>• 蓝色圆点是<b>合数</b>，继续向下分解。</li>
                <li>• 无论怎么拆，质因数集合<b>唯一确定</b>。</li>
                <li>• 这就是<b>算术基本定理</b>，数论的基石。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
