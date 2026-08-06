import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { mutualInformationNarration } from '../../narrations/scripts/mutual-information'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawMutualInformation } from './draw'
import SidePanel from './SidePanel'
import { PRESETS, type ChannelKind } from './mutualInformation'

const W = 680
const H = 540

export default function MutualInformationExperiment() {
  const [presetId, setPresetId] = useState('noisy')
  const [kind, setKind] = useState<ChannelKind>('bsc')
  const [a, setA] = useState(0.5)
  const [e, setE] = useState(0.1)
  const [camYaw, setCamYaw] = useState(0.76)
  const [camPitch, setCamPitch] = useState(0.42)
  const [showRidge, setShowRidge] = useState(true)
  const [spinning, setSpinning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(mutualInformationNarration)
  }, [narration])

  useEffect(() => {
    if (!spinning) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      setCamYaw(0.76 + ((ts - t0) / 1000) * 0.35)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [spinning])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawMutualInformation(canvas, { kind, a, e, camYaw, camPitch, showRidge })
  }, [kind, a, e, camYaw, camPitch, showRidge])

  const applyPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id) ?? PRESETS[0]
    setPresetId(id)
    setKind(p.kind)
    setA(p.a)
    setE(p.e)
  }

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">互信息与信道容量</h1>
            <p className="text-gray-600">知道了 Y，关于 X 的不确定性减少多少</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              沿 a 有个峰，沿 e 单调降到零
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">
              曲面是 I(a, e)。红色脊线是每个噪声下的容量——它就是沿 a 方向那些峰顶连成的线。
            </p>
          </div>

          <SidePanel
            presetId={presetId} kind={kind} a={a} e={e}
            camYaw={camYaw} camPitch={camPitch} showRidge={showRidge} spinning={spinning}
            presets={PRESETS}
            onPreset={applyPreset}
            onKind={(k) => { setKind(k); setPresetId('') }}
            onA={(v) => { setA(v); setPresetId('') }}
            onE={(v) => { setE(v); setPresetId('') }}
            onCamYaw={setCamYaw} onCamPitch={setCamPitch}
            onToggleRidge={() => setShowRidge((v) => !v)}
            onToggleSpin={() => setSpinning((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
