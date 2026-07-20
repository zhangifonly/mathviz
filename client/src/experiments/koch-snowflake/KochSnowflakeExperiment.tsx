import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { kochSnowflakeNarration } from '../../narrations/scripts/koch-snowflake'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { LEVELS, perimeter, area } from './kochSnowflake'
import { drawKochSnowflake } from './draw'

const W = 600
const H = 480

export default function KochSnowflakeExperiment() {
  const [level, setLevel] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(kochSnowflakeNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawKochSnowflake(canvas, level, true)
  }, [level])

  const peri = perimeter(1, level)
  const ar = area(1, level)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">科赫雪花</h1>
            <p className="text-gray-600">无穷周长有限面积的经典分形</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">迭代 {level} 层 · 共 {3 * Math.pow(4, level)} 条边</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">迭代层数</h3>
              <div className="space-y-2">
                {LEVELS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setLevel(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${level === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    第 {n} 层迭代
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">当前数值（边长取 1）</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>周长 = 3 × (4/3)<sup>{level}</sup> ≈ <b>{peri.toFixed(3)}</b></li>
                <li>面积 ≈ <b>{ar.toFixed(4)}</b>（趋于 8/5 × 初始面积）</li>
                <li>• 层数越高，周长越大，最终<b>发散到无穷</b>。</li>
                <li>• 面积却始终被<b>外接圆</b>框住，收敛到有限值。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
