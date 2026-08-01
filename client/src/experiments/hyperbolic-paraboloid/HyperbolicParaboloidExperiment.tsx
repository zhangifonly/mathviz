import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { hyperbolicParaboloidNarration } from '../../narrations/scripts/hyperbolic-paraboloid'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawHyperbolicParaboloid } from './draw'
import ControlPanel from './ControlPanel'

const W = 640
const H = 480

export default function HyperbolicParaboloidExperiment() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(1)
  const [family1, setFamily1] = useState(true)
  const [family2, setFamily2] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(hyperbolicParaboloidNarration)
  }, [narration])

  // 本实验用 Canvas 而非 Plotly: 需要单独高亮两族直线, Plotly 的 surface 做不到
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const el = (ts - start) / 1000
      drawHyperbolicParaboloid(canvas, {
        a, b, family1, family2,
        surfaceAlpha: family1 || family2 ? 0.5 : 1,
        yaw: 0.6 + el * 0.26,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [a, b, family1, family2])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">双曲抛物面</h1>
            <p className="text-gray-600">由两族直线铺满的马鞍面</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">自动旋转 · 黄线与青线是两族直线</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <ControlPanel
            a={a} b={b} family1={family1} family2={family2}
            onA={setA} onB={setB}
            onFamily1={() => setFamily1((v) => !v)}
            onFamily2={() => setFamily2((v) => !v)}
            onPreset={(na, nb) => { setA(na); setB(nb) }}
          />
        </div>
      </div>
    </>
  )
}
