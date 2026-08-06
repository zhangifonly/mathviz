import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { perronFrobeniusNarration } from '../../narrations/scripts/perron-frobenius'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawPerronFrobenius } from './draw'
import SidePanel from './SidePanel'
import { PRESETS, damp, type Mat3 } from './perronFrobenius'

const W = 680
const H = 540

export default function PerronFrobeniusExperiment() {
  const [presetId, setPresetId] = useState('positive')
  const [damping, setDamping] = useState(1)
  const [steps, setSteps] = useState(24)
  const [camYaw, setCamYaw] = useState(0.78)
  const [camPitch, setCamPitch] = useState(0.62)
  const [panel, setPanel] = useState<'both' | 'simplex' | 'spectrum'>('both')
  const [spinning, setSpinning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(perronFrobeniusNarration)
  }, [narration])

  useEffect(() => {
    if (!spinning) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      setCamYaw(0.78 + ((ts - t0) / 1000) * 0.35)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [spinning])

  const base = (PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]).A
  const A: Mat3 = damping < 1 ? damp(base, damping) : base

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPerronFrobenius(canvas, { A, steps, camYaw, camPitch, panel })
  }, [A, steps, camYaw, camPitch, panel])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Perron-Frobenius 定理</h1>
            <p className="text-gray-600">马氏链为什么会收敛，什么时候不会</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              谱隙大于零，才有唯一稳态
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">
              左：三条不同初值的轨迹在概率单纯形上爬行。右：特征值与单位圆，黄点是 Perron 根。
            </p>
          </div>

          <SidePanel
            presetId={presetId} A={A} damping={damping} steps={steps}
            camYaw={camYaw} camPitch={camPitch} panel={panel} spinning={spinning}
            presets={PRESETS}
            onPreset={(id) => { setPresetId(id); setDamping(1) }}
            onDamping={setDamping} onSteps={setSteps}
            onCamYaw={setCamYaw} onCamPitch={setCamPitch} onPanel={setPanel}
            onToggleSpin={() => setSpinning((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
