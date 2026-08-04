import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { solidAngleNarration } from '../../narrations/scripts/solid-angle'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawSolidAngle } from './draw'
import SidePanel from './SidePanel'
import {
  presetOf, triangleSolidAngle, solidFraction, PRESETS, type PresetId,
} from './solidAngle'

const W = 600
const H = 470

export default function SolidAngleExperiment() {
  const [presetId, setPresetId] = useState<PresetId>('octant')
  const [showCone, setShowCone] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(solidAngleNarration)
  }, [narration])

  const { a, b, c } = useMemo(() => presetOf(presetId), [presetId])
  const label = PRESETS.find((p) => p.id === presetId)?.label ?? ''

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      const omega = triangleSolidAngle(a, b, c)
      drawSolidAngle(canvas, {
        a, b, c,
        showCone,
        title: `${label} · Ω = ${omega.toFixed(4)} sr`,
        subtitle: `占全空间 4π 的 ${(solidFraction(omega) * 100).toFixed(2)}%`,
        yaw: 0.6 + el * 0.22,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [a, b, c, showCone, label])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">立体角与球面度</h1>
            <p className="text-gray-600">三维的角度怎么量</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">黄色区域是三条射线在单位球上截下的面积</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <SidePanel
            presetId={presetId} showCone={showCone} a={a} b={b} c={c}
            onPreset={setPresetId}
            onToggleCone={() => setShowCone((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
