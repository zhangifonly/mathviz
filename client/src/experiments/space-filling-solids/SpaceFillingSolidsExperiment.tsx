import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { spaceFillingSolidsNarration } from '../../narrations/scripts/space-filling-solids'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawSpaceFilling } from './draw'
import SidePanel from './SidePanel'
import type { FillKind } from './spaceFillingSolids'

const W = 640
const H = 480

export default function SpaceFillingSolidsExperiment() {
  const [kind, setKind] = useState<FillKind>('rhombicDodecahedron')
  const [copies, setCopies] = useState(4)
  const [showGap, setShowGap] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(spaceFillingSolidsNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawSpaceFilling(canvas, {
        kind,
        copies,
        showTetraGap: showGap,
        faceAlpha: copies > 1 ? 0.88 : 1,
        yaw: 0.6 + el * 0.22,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [kind, copies, showGap])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">空间填充多面体</h1>
            <p className="text-gray-600">亚里士多德错了一千八百年</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              {showGap ? '红色扇形就是那道千年缝隙' : '相邻胞用不同色区分'}
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <SidePanel
            kind={kind} copies={copies} showGap={showGap}
            onKind={(k) => { setKind(k); setShowGap(false) }}
            onCopies={setCopies}
            onToggleGap={() => setShowGap((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
