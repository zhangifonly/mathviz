import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { banachFixedPointNarration } from '../../narrations/scripts/banach-fixed-point'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawBanach } from './draw'
import SidePanel from './SidePanel'
import { PRESETS, type Mat2, type Vec2 } from './banachFixedPoint'

const W = 680
const H = 540

export default function BanachFixedPointExperiment() {
  const [presetId, setPresetId] = useState('strong')
  const [A, setA] = useState<Mat2>([[0.3, 0.1], [0.0, 0.4]])
  const [b, setB] = useState<Vec2>([1, 2])
  const [x0, setX0] = useState<Vec2>([0, 0])
  const [steps, setSteps] = useState(24)
  const [camYaw, setCamYaw] = useState(0.74)
  const [camPitch, setCamPitch] = useState(0.36)
  const [showCone, setShowCone] = useState(true)
  const [spinning, setSpinning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(banachFixedPointNarration)
  }, [narration])

  useEffect(() => {
    if (!spinning) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      setCamYaw(0.74 + ((ts - t0) / 1000) * 0.32)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [spinning])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawBanach(canvas, { A, b, x0, steps, camYaw, camPitch, showCone })
  }, [A, b, x0, steps, camYaw, camPitch, showCone])

  const applyPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id) ?? PRESETS[0]
    setPresetId(id)
    setA(p.A.map((r) => [...r]) as Mat2)
    setB([...p.b] as Vec2)
    setX0([...p.x0] as Vec2)
  }

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Banach 不动点定理</h1>
            <p className="text-gray-600">存在、唯一，还能事先算出要迭代多少次</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              竖直方向是步数，轨迹必须落在理论包络里
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">
              底面虚线是平面轨迹的投影，竖起来之后能同时看到「往哪走」和「走多快」。黄圈是先验误差界。
            </p>
          </div>

          <SidePanel
            presetId={presetId} A={A} b={b} x0={x0} steps={steps}
            camYaw={camYaw} camPitch={camPitch} showCone={showCone} spinning={spinning}
            presets={PRESETS}
            onPreset={applyPreset}
            onA={(v) => { setA(v); setPresetId('') }}
            onB={(v) => { setB(v); setPresetId('') }}
            onX0={(v) => { setX0(v); setPresetId('') }}
            onSteps={setSteps}
            onCamYaw={setCamYaw} onCamPitch={setCamPitch}
            onToggleCone={() => setShowCone((v) => !v)}
            onToggleSpin={() => setSpinning((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
