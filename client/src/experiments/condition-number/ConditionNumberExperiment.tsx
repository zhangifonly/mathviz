import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { conditionNumberNarration } from '../../narrations/scripts/condition-number'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawConditionNumber } from './draw'
import SidePanel from './SidePanel'
import { PRESETS, type Mat3 } from './conditionNumber'

const W = 680
const H = 520

export default function ConditionNumberExperiment() {
  const [A, setA] = useState<Mat3>(PRESETS[3].A.map((r) => [...r]))
  const [camYaw, setCamYaw] = useState(0.72)
  const [camPitch, setCamPitch] = useState(0.42)
  const [showWorst, setShowWorst] = useState(true)
  const [spinning, setSpinning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(conditionNumberNarration)
  }, [narration])

  useEffect(() => {
    if (!spinning) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      setCamYaw(0.72 + ((ts - t0) / 1000) * 0.4)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [spinning])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawConditionNumber(canvas, { A, camYaw, camPitch, showWorst })
  }, [A, camYaw, camPitch, showWorst])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">矩阵条件数与数值稳定性</h1>
            <p className="text-gray-600">椭球有多扁，误差就放大多少倍</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              κ = 最长半轴 ÷ 最短半轴
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">
              两侧用同一缩放画。球是各向同性的；椭球被压扁的方向，正是解会被误差污染的方向。
            </p>
          </div>

          <SidePanel
            A={A} camYaw={camYaw} camPitch={camPitch}
            showWorst={showWorst} spinning={spinning}
            presets={PRESETS}
            onA={setA} onCamYaw={setCamYaw} onCamPitch={setCamPitch}
            onToggleWorst={() => setShowWorst((v) => !v)}
            onToggleSpin={() => setSpinning((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
