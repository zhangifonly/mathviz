import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { parabolaOpticsNarration } from '../../narrations/scripts/parabola-optics'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { PARABOLA_OPTIONS } from './parabolaOptics'
import { drawParabolaOptics } from './draw'

const RAYS = 9

export default function ParabolaOpticsExperiment() {
  const [p, setP] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(parabolaOpticsNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.015)
      drawParabolaOptics(canvas, { p, rays: RAYS }, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [p])

  const info = PARABOLA_OPTIONS.find((o) => o.p === p)!

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">抛物线与光学</h1>
            <p className="text-gray-600">平行光经抛物面反射后聚于焦点</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.label} · 焦点 (0, {p})</h3>
            <canvas ref={canvasRef} width={620} height={560} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择焦准距 p</h3>
              <div className="space-y-2">
                {PARABOLA_OPTIONS.map((o) => (
                  <button
                    key={o.p}
                    onClick={() => setP(o.p)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${p === o.p ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${p === o.p ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">光学趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 抛物线上每点到<b>焦点</b>与到<b>准线</b>的距离恒相等。</li>
                <li>• 平行于对称轴的光线，反射后<b>全部汇聚到焦点</b>。</li>
                <li>• 把光源放在焦点，反射光变成<b>平行光束</b>，这就是探照灯。</li>
                <li>• 卫星天线、太阳灶、车灯反光碗，用的都是同一条曲线。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
