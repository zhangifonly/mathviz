import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { mobiusFunctionNarration } from '../../narrations/scripts/mobius-function'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { mertens, RANGE } from './mobiusFunction'
import { drawMobiusFunction } from './draw'

const W = 600
const H = 480

export default function MobiusFunctionExperiment() {
  const [range, setRange] = useState(60)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(mobiusFunctionNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawMobiusFunction(canvas, range)
  }, [range])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">莫比乌斯函数</h1>
            <p className="text-gray-600">数论中的正负零</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">1 到 {range} 的 μ(n) 与 M(n)</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            <p className="mt-2 text-sm text-gray-500">当前 M({range}) = {mertens(range)}</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">观察范围</h3>
              <div className="space-y-2">
                {RANGE.map((n) => (
                  <button
                    key={n}
                    onClick={() => setRange(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${range === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    1 到 {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• μ(n) 只取 <b>-1、0、+1</b> 三个值。</li>
                <li>• 含<b>平方因子</b>时 μ(n)=0，例如 μ(4)=μ(12)=0。</li>
                <li>• 无平方因子时 μ(n)=(-1)^<b>素因子个数</b>。</li>
                <li>• ∑<sub>d|n</sub> μ(d) 只在 n=1 时为 1，其余全为 0。</li>
                <li>• M(n) 的增长与<b>黎曼猜想</b>紧密相关。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
