import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { so3TopologyNarration } from '../../narrations/scripts/so3-topology'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawSO3Topology } from './draw'
import SidePanel from './SidePanel'
import { PRESETS } from './so3Topology'

const W = 680
const H = 520

export default function SO3TopologyExperiment() {
  const [turns, setTurns] = useState(1)
  const [t, setT] = useState(1)
  const [camYaw, setCamYaw] = useState(0.7)
  const [camPitch, setCamPitch] = useState(0.34)
  const [liftOnly, setLiftOnly] = useState(false)
  const [playing, setPlaying] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(so3TopologyNarration)
  }, [narration])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      setT(((ts - t0) / 3600) % 1)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawSO3Topology(canvas, { turns, t, camYaw, camPitch, liftOnly })
  }, [turns, t, camYaw, camPitch, liftOnly])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">SO(3) 的拓扑</h1>
            <p className="text-gray-600">转一圈的旋转收不成一点，转两圈的可以</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              提升回到原点，还是一路跑向无穷远
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">
              右边的物体每转满整数圈都回到原样；左边的提升却记得转了几圈——奇数圈落在 −1，投影跑向画外。
            </p>
          </div>

          <SidePanel
            turns={turns} t={t} camYaw={camYaw} camPitch={camPitch}
            liftOnly={liftOnly} playing={playing} presets={PRESETS}
            onTurns={setTurns} onT={setT}
            onCamYaw={setCamYaw} onCamPitch={setCamPitch}
            onToggleLiftOnly={() => setLiftOnly((v) => !v)}
            onTogglePlay={() => setPlaying((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
