import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { reuleauxNarration } from '../../narrations/scripts/reuleaux'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SIDES, reuleauxArea, reuleauxPerimeter } from './reuleaux'
import { drawReuleaux, drawRolling } from './draw'

const W = 600
const H = 480
const WIDTH = 260

export default function ReuleauxExperiment() {
  const [sides, setSides] = useState(3)
  const [rolling, setRolling] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(reuleauxNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!rolling) {
      drawReuleaux(canvas, sides, WIDTH, true)
      return
    }
    let phase = 0
    const tick = () => {
      phase = (phase + 0.004) % 1
      drawRolling(canvas, sides, WIDTH, phase)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [sides, rolling])

  const area = reuleauxArea(sides, WIDTH).toFixed(0)
  const peri = reuleauxPerimeter(WIDTH).toFixed(0)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">等宽曲线</h1>
            <p className="text-gray-600">勒洛三角形 — 不是圆，却处处等宽</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{sides} 边勒洛多边形 · 宽度恒为 {WIDTH}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择边数（奇数）</h3>
              <div className="space-y-2">
                {SIDES.map((n) => (
                  <button
                    key={n}
                    onClick={() => setSides(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${sides === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n} 边勒洛多边形
                  </button>
                ))}
              </div>
              <button onClick={() => setRolling((r) => !r)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                {rolling ? '⏸ 停止滚动' : '▶ 在平行线间滚动'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">数据与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 面积 ≈ <b>{area}</b>，周长 = π·宽 ≈ <b>{peri}</b>（巴比尔定理）。</li>
                <li>• 滚动时顶端始终贴住上线，<b>宽度恒定</b>，但形心上下颠簸。</li>
                <li>• 能钻出<b>近似方孔</b>的钻头，正是基于勒洛三角形。</li>
                <li>• 英国 50 便士硬币是<b>勒洛七边形</b>，等宽便于自动售货机识别。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
