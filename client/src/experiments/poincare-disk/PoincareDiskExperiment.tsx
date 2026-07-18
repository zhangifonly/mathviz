import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { poincareDiskNarration } from '../../narrations/scripts/poincare-disk'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { geodesic, hyperbolicDistance, radialGeodesics, TILINGS, type Pt } from './poincareDisk'
import { drawPoincareDisk } from './draw'

const W = 600
const H = 480

export default function PoincareDiskExperiment() {
  const [ti, setTi] = useState(0)
  const [showParallels, setShowParallels] = useState(true)
  const [p1, setP1] = useState<Pt>({ x: -0.45, y: 0.2 })
  const [p2, setP2] = useState<Pt>({ x: 0.4, y: -0.35 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(poincareDiskNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const extra = showParallels ? radialGeodesics(6) : []
    drawPoincareDisk(canvas, TILINGS[ti], [...extra, geodesic(p1, p2)], [p1, p2])
  }, [ti, showParallels, p1, p2])

  const drag = useRef<null | 1 | 2>(null)
  const toDisk = (e: React.MouseEvent): Pt => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const R = Math.min(W, H) / 2 - 12
    const x = ((e.clientX - rect.left) * (W / rect.width) - W / 2) / R
    const y = -((e.clientY - rect.top) * (H / rect.height) - H / 2) / R
    const n = Math.hypot(x, y)
    return n >= 0.97 ? { x: (x / n) * 0.97, y: (y / n) * 0.97 } : { x, y }
  }
  const put = (p: Pt) => (drag.current === 1 ? setP1(p) : setP2(p))
  const onDown = (e: React.MouseEvent) => {
    const p = toDisk(e)
    drag.current = hyperbolicDistance(p, p1) < hyperbolicDistance(p, p2) ? 1 : 2
    put(p)
  }
  const onMove = (e: React.MouseEvent) => { if (drag.current) put(toDisk(e)) }
  const dist = hyperbolicDistance(p1, p2)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">庞加莱圆盘</h1>
            <p className="text-gray-600">双曲几何模型</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{`{${TILINGS[ti].p},${TILINGS[ti].q}}`} 镶嵌 · 拖动红点看测地线</h3>
            <canvas ref={canvasRef} width={W} height={H} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={() => (drag.current = null)} onMouseLeave={() => (drag.current = null)} className="w-full rounded-lg bg-slate-50 cursor-pointer" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">镶嵌 {'{p,q}'}</h3>
              <div className="space-y-2">
                {TILINGS.map((t, i) => (
                  <button key={i} onClick={() => setTi(i)} className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${ti === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    {`{${t.p},${t.q}}`} 正{t.p}边形镶嵌
                  </button>
                ))}
              </div>
              <button onClick={() => setShowParallels((v) => !v)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                {showParallels ? '隐藏' : '显示'}过原点的多条测地线
              </button>
              <p className="mt-3 text-sm text-gray-600">两红点双曲距离：<b>{dist.toFixed(3)}</b></p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 圆盘<b>边界</b>代表无穷远，永远到不了。</li>
                <li>• 测地线是<b>垂直边界</b>的圆弧（或直径）。</li>
                <li>• 过直线外一点可作<b>无穷多</b>条平行线，第五公设失效。</li>
                <li>• 越靠边界，等大瓦片看起来越小，其实全等。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
