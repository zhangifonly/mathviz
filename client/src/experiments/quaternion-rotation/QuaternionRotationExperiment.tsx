import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { quaternionRotationNarration } from '../../narrations/scripts/quaternion-rotation'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawQuaternionRotation, type Mode } from './draw'
import SidePanel from './SidePanel'
import { PRESETS } from './quaternionRotation'

const W = 680
const H = 520

export default function QuaternionRotationExperiment() {
  const [presetId, setPresetId] = useState('wide')
  const [t, setT] = useState(0.35)
  const [mode, setMode] = useState<Mode>('compare')
  const [camYaw, setCamYaw] = useState(0.6)
  const [camPitch, setCamPitch] = useState(0.32)
  const [showTrail, setShowTrail] = useState(true)
  const [playing, setPlaying] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(quaternionRotationNarration)
  }, [narration])

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]

  // 来回播放，看清两条路径的快慢差别
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const u = ((ts - t0) / 2600) % 2
      setT(u <= 1 ? u : 2 - u)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawQuaternionRotation(canvas, {
      from: preset.from, to: preset.to, t, mode,
      camYaw, camPitch, showTrail,
    })
  }, [preset, t, mode, camYaw, camPitch, showTrail])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">四元数与三维旋转</h1>
            <p className="text-gray-600">半角、双重覆盖，以及为什么工程上用它做插值</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              轨迹上的点距是否均匀，就是角速度匀不匀
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">
              {preset.note}。左下角两个指标测的是两种毛病：「总转角」看路走得冤不冤，「max/min」看快慢匀不匀。
            </p>
          </div>

          <SidePanel
            presetId={presetId} t={t} mode={mode}
            camYaw={camYaw} camPitch={camPitch}
            showTrail={showTrail} playing={playing}
            onPreset={setPresetId} onT={setT} onMode={setMode}
            onCamYaw={setCamYaw} onCamPitch={setCamPitch}
            onToggleTrail={() => setShowTrail((v) => !v)}
            onTogglePlay={() => setPlaying((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
