import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { brachistochroneNarration } from '../../narrations/scripts/brachistochrone'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawBrachistochrone } from './draw'
import { descentTime, straightPath } from './brachistochrone'

const W = 600
const H = 480
const BX = 440
const BY = 340

export default function BrachistochroneExperiment() {
  const [running, setRunning] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(brachistochroneNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const total = descentTime(straightPath(BX, BY))
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const elapsed = running ? ((ts - start) / 1000) % (total + 0.8) : 0
      drawBrachistochrone(canvas, BX, BY, elapsed)
      if (running) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [running])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">最速降线</h1>
            <p className="text-gray-600">下滑最快的曲线是摆线</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">三球竞速：摆线 · 圆弧 · 直线</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            <button onClick={() => setRunning((r) => !r)} className="mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
              {running ? '⏸ 暂停' : '▶ 重新竞速'}
            </button>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 能量守恒：速度 <b>v=√(2gy)</b> 只取决于下落高度。</li>
                <li>• 先陡的路径更早获得速度，反而更快到底。</li>
                <li>• 最快的曲线是<b>摆线</b>，而非直线或圆弧。</li>
                <li>• 摆线也是<b>等时曲线</b>：任意点释放到底用时相同。</li>
                <li>• 此问题由伯努利提出，催生了<b>变分法</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
