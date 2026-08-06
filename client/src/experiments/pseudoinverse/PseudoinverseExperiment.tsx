import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { pseudoinverseNarration } from '../../narrations/scripts/pseudoinverse'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawPseudoinverse } from './draw'
import SidePanel from './SidePanel'
import { PRESETS, type Mat3, type Vec3 } from './pseudoinverse'

const W = 680
const H = 540

export default function PseudoinverseExperiment() {
  const [presetId, setPresetId] = useState('rank2')
  const [A, setA] = useState<Mat3>(PRESETS[1].A.map((r) => [...r]))
  const [b, setB] = useState<Vec3>([...PRESETS[1].b] as Vec3)
  const [nullShift, setNullShift] = useState(0)
  const [camYaw, setCamYaw] = useState(0.72)
  const [camPitch, setCamPitch] = useState(0.4)
  const [panel, setPanel] = useState<'both' | 'b' | 'x'>('both')
  const [spinning, setSpinning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(pseudoinverseNarration)
  }, [narration])

  useEffect(() => {
    if (!spinning) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      setCamYaw(0.72 + ((ts - t0) / 1000) * 0.35)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [spinning])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPseudoinverse(canvas, { A, b, camYaw, camPitch, nullShift, panel })
  }, [A, b, camYaw, camPitch, nullShift, panel])

  const applyPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id) ?? PRESETS[0]
    setPresetId(id)
    setA(p.A.map((r) => [...r]))
    setB([...p.b] as Vec3)
    setNullShift(0)
  }

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Moore-Penrose 伪逆</h1>
            <p className="text-gray-600">方程无解或有无穷多解时，它都给一个答案</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              残差最小；若还不唯一，再取范数最小
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">
              左：b 投到列空间，红虚线是残差，它与列空间垂直。右：粉色是零空间，沿它挪动解，残差不变但向量变长。
            </p>
          </div>

          <SidePanel
            presetId={presetId} A={A} b={b} nullShift={nullShift}
            camYaw={camYaw} camPitch={camPitch} panel={panel} spinning={spinning}
            presets={PRESETS}
            onPreset={applyPreset} onA={setA} onB={setB} onNullShift={setNullShift}
            onCamYaw={setCamYaw} onCamPitch={setCamPitch} onPanel={setPanel}
            onToggleSpin={() => setSpinning((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
