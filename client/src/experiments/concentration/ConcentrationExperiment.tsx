import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { concentrationNarration } from '../../narrations/scripts/concentration'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawConcentration } from './draw'
import SidePanel from './SidePanel'
import { PRESETS } from './concentration'

const W = 680
const H = 540

export default function ConcentrationExperiment() {
  const [presetId, setPresetId] = useState('wide')
  const [t, setT] = useState(0.2)
  const [nMax, setNMax] = useState(120)
  const [p, setP] = useState(0.5)
  const [camYaw, setCamYaw] = useState(0.82)
  const [camPitch, setCamPitch] = useState(0.42)
  const [show, setShow] = useState<[boolean, boolean, boolean]>([true, true, true])
  const [spinning, setSpinning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(concentrationNarration)
  }, [narration])

  useEffect(() => {
    if (!spinning) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      setCamYaw(0.82 + ((ts - t0) / 1000) * 0.3)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [spinning])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawConcentration(canvas, {
      t, nMax, setup: { p, a: 0, b: 1 }, camYaw, camPitch, show,
    })
  }, [t, nMax, p, camYaw, camPitch, show])

  const applyPreset = (id: string) => {
    const pr = PRESETS.find((x) => x.id === id) ?? PRESETS[0]
    setPresetId(id)
    setT(pr.t)
    setNMax(pr.nMax)
  }

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">集中不等式</h1>
            <p className="text-gray-600">大数定律说会收敛，这里回答收敛得有多快</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              两个界的形状不同：一个是缓坡，一个是陡崖
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">
              竖轴是<b>对数</b>刻度（跨几十个数量级，线性轴什么也看不出）。粉色虚线是当前 t 的剖面。
            </p>
          </div>

          <SidePanel
            presetId={presetId} t={t} nMax={nMax} p={p}
            camYaw={camYaw} camPitch={camPitch} show={show} spinning={spinning}
            presets={PRESETS}
            onPreset={applyPreset} onT={setT} onNMax={setNMax} onP={setP}
            onCamYaw={setCamYaw} onCamPitch={setCamPitch}
            onToggleShow={(i) => setShow((s) => {
              const n = [...s] as [boolean, boolean, boolean]
              n[i] = !n[i]
              return n
            })}
            onToggleSpin={() => setSpinning((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
