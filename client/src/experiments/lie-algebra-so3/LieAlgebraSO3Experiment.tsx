import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { lieAlgebraSO3Narration } from '../../narrations/scripts/lie-algebra-so3'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawLieAlgebraSO3, type Mode } from './draw'
import SidePanel from './SidePanel'
import { PRESETS, type Vec3 } from './lieAlgebraSO3'

const W = 680
const H = 520

export default function LieAlgebraSO3Experiment() {
  const [omega, setOmega] = useState<Vec3>([0, 0, 1])
  const [t, setT] = useState(1.2)
  const [mode, setMode] = useState<Mode>('exp')
  const [terms, setTerms] = useState(4)
  const [camYaw, setCamYaw] = useState(0.7)
  const [camPitch, setCamPitch] = useState(0.32)
  const [playing, setPlaying] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(lieAlgebraSO3Narration)
  }, [narration])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      setT((((ts - t0) / 2400) % 1) * 3)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawLieAlgebraSO3(canvas, { omega, t, mode, terms, camYaw, camPitch })
  }, [omega, t, mode, terms, camYaw, camPitch])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">矩阵指数与李代数 so(3)</h1>
            <p className="text-gray-600">无穷小旋转指数出有限旋转</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              一个向量 ω，指数出一整条旋转
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">
              左边是切空间里的 ω（反对称矩阵的三个自由参数）；右边是 exp(tω) 作用出的旋转。
            </p>
          </div>

          <SidePanel
            omega={omega} t={t} mode={mode} terms={terms}
            camYaw={camYaw} camPitch={camPitch} playing={playing}
            presets={PRESETS}
            onOmega={setOmega} onT={setT} onMode={setMode} onTerms={setTerms}
            onCamYaw={setCamYaw} onCamPitch={setCamPitch}
            onTogglePlay={() => setPlaying((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
