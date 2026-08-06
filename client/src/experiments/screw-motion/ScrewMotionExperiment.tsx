import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { screwMotionNarration } from '../../narrations/scripts/screw-motion'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawScrewMotion } from './draw'
import SidePanel from './SidePanel'
import { PRESETS, type Vec3 } from './screwMotion'

const W = 680
const H = 540

export default function ScrewMotionExperiment() {
  const [presetId, setPresetId] = useState('general')
  const [u, setU] = useState(0.45)
  const [camYaw, setCamYaw] = useState(0.75)
  // 俯仰太小时螺旋线被压成细弧，看不出"螺旋"
  const [camPitch, setCamPitch] = useState(0.62)
  const [showTrails, setShowTrails] = useState(true)
  const [showDecomp, setShowDecomp] = useState(true)
  const [playing, setPlaying] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(screwMotionNarration)
  }, [narration])

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const v = ((ts - t0) / 3000) % 2
      setU(v <= 1 ? v : 2 - v)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawScrewMotion(canvas, {
      axis: preset.axis as Vec3, theta: preset.theta, t: preset.t as Vec3,
      u, camYaw, camPitch, showTrails, showDecomp,
    })
  }, [preset, u, camYaw, camPitch, showTrails, showDecomp])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">螺旋运动与 Chasles 定理</h1>
            <p className="text-gray-600">任何刚体运动都是绕一条轴的"拧螺丝"</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              轴上的点走直线，其余的点走螺旋线
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">
              {preset.note}。绿色那条直线段是轴上一点的轨迹——它只沿轴平移，不绕转。
            </p>
          </div>

          <SidePanel
            presetId={presetId} u={u}
            camYaw={camYaw} camPitch={camPitch}
            showTrails={showTrails} showDecomp={showDecomp} playing={playing}
            presets={PRESETS}
            onPreset={setPresetId} onU={setU}
            onCamYaw={setCamYaw} onCamPitch={setCamPitch}
            onToggleTrails={() => setShowTrails((v) => !v)}
            onToggleDecomp={() => setShowDecomp((v) => !v)}
            onTogglePlay={() => setPlaying((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
