import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { minkowskiSteinerNarration } from '../../narrations/scripts/minkowski-steiner'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawMinkowski } from './draw'
import SidePanel from './SidePanel'
import { solidOf, steinerTerms, type SolidId } from './minkowskiSteiner'

const W = 600
const H = 470

export default function MinkowskiSteinerExperiment() {
  const [solidId, setSolidId] = useState<SolidId>('cube')
  const [r, setR] = useState(0.4)
  const [highlight, setHighlight] = useState<0 | 1 | 2 | 3 | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(minkowskiSteinerNarration)
  }, [narration])

  const solid = useMemo(() => solidOf(solidId), [solidId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      const t = steinerTerms(solid, r)
      drawMinkowski(canvas, {
        solid, r, highlight,
        title: `${solid.label} ⊕ ${r.toFixed(2)}B`,
        subtitle: `V(r) = ${t.total.toFixed(4)}，顶点项 ${t.vertices.toFixed(4)} 恒为一整个球`,
        yaw: 0.6 + el * 0.2,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [solid, r, highlight])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">闵可夫斯基和与斯坦纳公式</h1>
            <p className="text-gray-600">用球擦一遍，体积变成 r 的三次多项式</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">四种颜色对应斯坦纳公式的四项</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <SidePanel
            solid={solid} solidId={solidId} r={r} highlight={highlight}
            onSolid={setSolidId} onR={setR} onHighlight={setHighlight}
          />
        </div>
      </div>
    </>
  )
}
