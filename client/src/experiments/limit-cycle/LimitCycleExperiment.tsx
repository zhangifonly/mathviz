import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { limitCycleNarration } from '../../narrations/scripts/limit-cycle'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { MU_VALUES } from './limitCycle'
import { drawLimitCycle } from './draw'

const W = 600
const H = 480

export default function LimitCycleExperiment() {
  const [mu, setMu] = useState(1)
  const [progress, setProgress] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(limitCycleNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawLimitCycle(canvas, mu, progress)
  }, [mu, progress])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const replay = () => {
    cancelAnimationFrame(rafRef.current)
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 2500)
      setProgress(p)
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    setProgress(0.02)
    rafRef.current = requestAnimationFrame(tick)
  }

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">极限环</h1>
            <p className="text-gray-600">范德波尔的自持振荡</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">相平面 · mu = {mu} · 多初值收敛到同一环</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">阻尼参数 mu</h3>
              <div className="space-y-2">
                {MU_VALUES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMu(m)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${mu === m ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    mu = {m}
                  </button>
                ))}
              </div>
              <button onClick={replay} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                ▶ 重新演示收敛过程
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与应用</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 方程 <b>x'' - mu(1-x²)x' + x = 0</b>，用 RK4 数值积分。</li>
                <li>• 小振幅时负阻尼<b>供能</b>，大振幅时正阻尼<b>耗能</b>。</li>
                <li>• 两种作用平衡出一条<b>孤立闭轨</b>——极限环。</li>
                <li>• 心跳、脑电、电子振荡器都是这种<b>自持振荡</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
