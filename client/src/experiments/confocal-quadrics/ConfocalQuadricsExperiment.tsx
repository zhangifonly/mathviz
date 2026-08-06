import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { confocalQuadricsNarration } from '../../narrations/scripts/confocal-quadrics'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawConfocalQuadrics } from './draw'
import SidePanel from './SidePanel'
import { PRESETS } from './confocalQuadrics'

const W = 660
const H = 560

export default function ConfocalQuadricsExperiment() {
  const [point, setPoint] = useState<[number, number, number]>([1.2, 0.9, 0.6])
  const [yaw, setYaw] = useState(0.7)
  const [pitch, setPitch] = useState(0.45)
  const [show, setShow] = useState<[boolean, boolean, boolean]>([true, true, true])
  const [showNormals, setShowNormals] = useState(true)
  // 三张面同时开时必须够透明才看得穿, 0.5 会互相遮死
  const [alpha, setAlpha] = useState(0.32)
  const [spinning, setSpinning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(confocalQuadricsNarration)
  }, [narration])

  useEffect(() => {
    if (!spinning) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      setYaw(0.7 + ((ts - t0) / 1000) * 0.45)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [spinning])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawConfocalQuadrics(canvas, { point, yaw, pitch, show, showNormals, alpha })
  }, [point, yaw, pitch, show, showNormals, alpha])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">共焦二次曲面</h1>
            <p className="text-gray-600">空间中每一点，都有三张互相垂直的曲面穿过</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              一个 λ 一张面，三段取值给出三种曲面
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">
              拖动 P 的坐标，三张面跟着变，但三条法向量始终两两垂直（左下角三个角度）。
            </p>
          </div>

          <SidePanel
            point={point} yaw={yaw} pitch={pitch}
            show={show} showNormals={showNormals} alpha={alpha} spinning={spinning}
            presets={PRESETS}
            onPoint={setPoint} onYaw={setYaw} onPitch={setPitch}
            onToggleShow={(i) => setShow((s) => {
              const n = [...s] as [boolean, boolean, boolean]
              n[i] = !n[i]
              return n
            })}
            onToggleNormals={() => setShowNormals((v) => !v)}
            onAlpha={setAlpha}
            onToggleSpin={() => setSpinning((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
