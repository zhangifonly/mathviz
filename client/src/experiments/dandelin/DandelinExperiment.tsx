import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { dandelinNarration } from '../../narrations/scripts/dandelin'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawDandelin } from './draw'
import SidePanel from './SidePanel'
import { presetOf, eccentricity, isEllipse, type PresetId } from './dandelin'

const W = 640
const H = 500
const DEG = 180 / Math.PI

export default function DandelinExperiment() {
  const [presetId, setPresetId] = useState<PresetId>('strong')
  const [theta, setTheta] = useState(0.7)
  const [phi, setPhi] = useState(0.6)
  const [showProof, setShowProof] = useState(true)
  const [showSpheres, setShowSpheres] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(dandelinNarration)
  }, [narration])

  const base = useMemo(() => presetOf(presetId), [presetId])
  const cut = useMemo(() => ({ ...base, theta }), [base, theta])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawDandelin(canvas, {
        cut, phi, showProof, showSpheres,
        yaw: 0.7 + el * 0.16,
        subtitle: isEllipse(cut)
          ? `α=${(cut.alpha * DEG).toFixed(0)}° θ=${(theta * DEG).toFixed(0)}° · 离心率 ${eccentricity(cut).toFixed(4)}`
          : '',
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [cut, phi, showProof, showSpheres, theta])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dandelin 双球</h1>
            <p className="text-gray-600">为什么斜切圆锥得到的是椭圆</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              两球与平面的切点，就是椭圆的两个焦点
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <SidePanel
            presetId={presetId} theta={theta} phi={phi}
            showProof={showProof} showSpheres={showSpheres}
            onPreset={(id) => {
              setPresetId(id)
              setTheta(presetOf(id).theta)
            }}
            onTheta={setTheta} onPhi={setPhi}
            onToggleProof={() => setShowProof((v) => !v)}
            onToggleSpheres={() => setShowSpheres((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
