import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { entropyCodingNarration } from '../../narrations/scripts/entropy-coding'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawEntropyCoding } from './draw'
import SidePanel from './SidePanel'
import { PRESETS, normalize, type Dist } from './entropyCoding'

const W = 680
const H = 540

export default function EntropyCodingExperiment() {
  const [presetId, setPresetId] = useState('skew')
  const [p, setP] = useState<Dist>([0.7, 0.2, 0.1])
  const [camYaw, setCamYaw] = useState(0.68)
  const [camPitch, setCamPitch] = useState(0.44)
  const [show, setShow] = useState<[boolean, boolean, boolean]>([true, true, false])
  const [blockK, setBlockK] = useState(1)
  const [spinning, setSpinning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(entropyCodingNarration)
  }, [narration])

  useEffect(() => {
    if (!spinning) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      setCamYaw(0.68 + ((ts - t0) / 1000) * 0.35)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [spinning])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawEntropyCoding(canvas, { p, camYaw, camPitch, show })
  }, [p, camYaw, camPitch, show])

  const applyPreset = (id: string) => {
    const pr = PRESETS.find((x) => x.id === id) ?? PRESETS[0]
    setPresetId(id)
    setP([...pr.p])
  }

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">信息熵与信源编码定理</h1>
            <p className="text-gray-600">熵就是压缩的极限，哈夫曼差它不到一比特</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              熵是光滑的穹顶，码长是阶梯
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">
              底面三角形是所有三元分布。绿色是熵，黄色是哈夫曼平均码长——码长只能取整数，所以是阶梯状，两者之差就是浪费。
            </p>
          </div>

          <SidePanel
            presetId={presetId} p={p} blockK={blockK}
            camYaw={camYaw} camPitch={camPitch} show={show} spinning={spinning}
            presets={PRESETS}
            onPreset={applyPreset}
            onP={(v) => { setP(normalize(v)); setPresetId('') }}
            onBlockK={setBlockK}
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
