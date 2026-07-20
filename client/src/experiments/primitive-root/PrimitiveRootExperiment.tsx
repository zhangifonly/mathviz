import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { primitiveRootNarration } from '../../narrations/scripts/primitive-root'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { PRIMES, findPrimitiveRoots, isPrimitiveRoot, orbitSize } from './primitiveRoot'
import { drawPrimitiveRoot } from './draw'

const W = 600
const H = 480

export default function PrimitiveRootExperiment() {
  const [p, setP] = useState(7)
  const [g, setG] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(primitiveRootNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPrimitiveRoot(canvas, g, p)
  }, [g, p])

  const roots = findPrimitiveRoots(p)
  const root = isPrimitiveRoot(g, p)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">原根</h1>
            <p className="text-gray-600">模 p 的生成元</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">g={g} 的幂在模 {p} 圆环上的轨迹</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择素数 p</h3>
              <div className="flex gap-2">
                {PRIMES.map((n) => (
                  <button
                    key={n}
                    onClick={() => { setP(n); setG(findPrimitiveRoots(n)[0] ?? 2) }}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${p === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">选择底数 g</h3>
              <div className="grid grid-cols-5 gap-1.5">
                {Array.from({ length: p - 2 }, (_, i) => i + 2).map((v) => (
                  <button
                    key={v}
                    onClick={() => setG(v)}
                    className={`px-2 py-1.5 rounded text-sm font-medium ${g === v ? 'bg-purple-500 text-white' : isPrimitiveRoot(v, p) ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">
                g={g} {root ? '是原根 ✓' : '不是原根'}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 幂轨迹覆盖 <b>{orbitSize(g, p)}</b> / {p - 1} 个非零余数。</li>
                <li>• 模 {p} 的全部原根：<b>{roots.join(', ')}</b>。</li>
                <li>• 原根遍历所有余数，是乘法群的<b>生成元</b>。</li>
                <li>• 蓝底格 = 该 g 为原根，灰底 = 非原根。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
