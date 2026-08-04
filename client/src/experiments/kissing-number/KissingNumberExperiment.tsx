import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { kissingNumberNarration } from '../../narrations/scripts/kissing-number'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawKissing } from './draw'
import SidePanel from './SidePanel'
import { arrangementOf, minPairAngle, type ArrangementId } from './kissingNumber'

const W = 600
const H = 470
const DEG = 180 / Math.PI

export default function KissingNumberExperiment() {
  const [arrId, setArrId] = useState<ArrangementId>('icosahedral')
  const [showCaps, setShowCaps] = useState(true)
  const [showGap, setShowGap] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(kissingNumberNarration)
  }, [narration])

  const arr = useMemo(() => arrangementOf(arrId), [arrId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawKissing(canvas, {
        dirs: arr.dirs, showCaps, showGap,
        title: `${arr.label} · ${arr.dirs.length} 个邻球`,
        subtitle: `最小角距 ${(minPairAngle(arr.dirs) * DEG).toFixed(2)}°`,
        yaw: 0.6 + el * 0.2,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [arr, showCaps, showGap])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">接吻数问题</h1>
            <p className="text-gray-600">牛顿说 12，格雷戈里说 13</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">蓝色是中心球，橙色是贴上去的邻球</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <SidePanel
            arrId={arrId} showCaps={showCaps} showGap={showGap}
            onArr={setArrId}
            onToggleCaps={() => setShowCaps((v) => !v)}
            onToggleGap={() => setShowGap((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
