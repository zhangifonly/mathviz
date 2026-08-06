import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { gershgorinNarration } from '../../narrations/scripts/gershgorin'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawGershgorin } from './draw'
import SidePanel from './SidePanel'
import { PRESETS, type Mat3 } from './gershgorin'

const W = 680
const H = 540

export default function GershgorinExperiment() {
  const [A, setA] = useState<Mat3>(PRESETS[1].A.map((r) => [...r]))
  // 接近俯视，圆盘才看着像圆；yaw 压小让实轴基本水平
  const [camYaw, setCamYaw] = useState(0.12)
  const [camPitch, setCamPitch] = useState(1.15)
  const [showCols, setShowCols] = useState(true)
  const [showComponents, setShowComponents] = useState(true)
  const [spinning, setSpinning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(gershgorinNarration)
  }, [narration])

  useEffect(() => {
    if (!spinning) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      setCamYaw(0.62 + ((ts - t0) / 1000) * 0.35)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [spinning])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawGershgorin(canvas, { A, camYaw, camPitch, showCols, showComponents })
  }, [A, camYaw, camPitch, showCols, showComponents])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gershgorin 圆盘定理</h1>
            <p className="text-gray-600">不解方程，也能把特征值圈起来</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              圆心是对角元，半径是那一行剩下的绝对值之和
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">
              两层都是复平面：上层行圆盘，下层列圆盘。黄点是特征值，虚线把它在两层上的位置连起来。
            </p>
          </div>

          <SidePanel
            A={A} camYaw={camYaw} camPitch={camPitch}
            showCols={showCols} showComponents={showComponents} spinning={spinning}
            presets={PRESETS}
            onA={setA} onCamYaw={setCamYaw} onCamPitch={setCamPitch}
            onToggleCols={() => setShowCols((v) => !v)}
            onToggleComponents={() => setShowComponents((v) => !v)}
            onToggleSpin={() => setSpinning((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
