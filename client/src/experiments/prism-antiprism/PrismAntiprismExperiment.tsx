import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { prismAntiprismNarration } from '../../narrations/scripts/prism-antiprism'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawPolyhedron } from '../../lib/drawPolyhedron'
import SidePanel from './SidePanel'
import { solidOf, infoOf, isCubeCase, isOctahedronCase, type SolidKind } from './prismAntiprism'

const W = 640
const H = 480

export default function PrismAntiprismExperiment() {
  const [kind, setKind] = useState<SolidKind>('antiprism')
  const [n, setN] = useState(5)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(prismAntiprismNarration)
  }, [narration])

  const poly = useMemo(() => solidOf(kind, n), [kind, n])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      const tag = (kind === 'prism' && isCubeCase(n)) ? ' = 立方体'
        : (kind === 'antiprism' && isOctahedronCase(n)) ? ' = 正八面体' : ''
      drawPolyhedron(canvas, {
        poly,
        title: `${poly.name}${tag}`,
        subtitle: `侧面为${infoOf(kind).sideShape} · ${infoOf(kind).note}`,
        showVertices: true,
        showEuler: true,
        ramp: 'ocean',
        yaw: 0.6 + el * 0.24,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [poly, kind, n])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">棱柱与反棱柱</h1>
            <p className="text-gray-600">被分类定理排除的两族</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">试试棱柱 n=4 与反棱柱 n=3</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <SidePanel kind={kind} n={n} onKind={setKind} onN={setN} />
        </div>
      </div>
    </>
  )
}
