import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { archimedeanSolidsNarration } from '../../narrations/scripts/archimedean-solids'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawPolyhedron } from '../../lib/drawPolyhedron'
import { platonicOf } from '../platonic-solids/platonicSolids'
import SidePanel from './SidePanel'
import { truncate, rectify, idealT, infoOf, type TruncBase } from './archimedeanSolids'

const W = 640
const H = 480

export default function ArchimedeanSolidsExperiment() {
  const [base, setBase] = useState<TruncBase>('cube')
  const [t, setT] = useState(idealT('cube'))
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(archimedeanSolidsNarration)
  }, [narration])

  // 截角要算棱表与环序排序, 按参数缓存避免每帧重算。
  // t=0.5 必须走 rectify: truncate 在该处会让棱中点的两个新顶点重合,
  // V/E/F 会算成 24/36/14 而非立方八面体的 12/24/14。
  const poly = useMemo(
    () => (Math.abs(t - 0.5) < 1e-6
      ? rectify(platonicOf(base))
      : truncate(platonicOf(base), t)),
    [base, t],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawPolyhedron(canvas, {
        poly,
        title: Math.abs(t - 0.5) < 1e-6 ? `截半${infoOf(base).label.slice(2)}` : infoOf(base).label,
        subtitle: `t = ${t.toFixed(4)} · ${infoOf(base).note}`,
        showVertices: true,
        showEuler: true,
        ramp: 'plasma',
        yaw: 0.6 + el * 0.24,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [poly, base, t])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">阿基米德立体</h1>
            <p className="text-gray-600">把顶点切掉会得到什么</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">拖动 t 观察从浅切到截半</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <SidePanel base={base} t={t} onBase={setBase} onT={setT} />
        </div>
      </div>
    </>
  )
}
