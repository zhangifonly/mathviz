import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { conicReflectionNarration } from '../../narrations/scripts/conic-reflection'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawConicReflection } from './draw'
import SidePanel from './SidePanel'
import { PRESETS } from './conicReflection'

const W = 640
const H = 500

export default function ConicReflectionExperiment() {
  const [presetId, setPresetId] = useState('ellipse')
  const [t, setT] = useState(1.1)
  const [showTangent, setShowTangent] = useState(true)
  const [mode, setMode] = useState<'single' | 'fan' | 'billiard'>('single')
  const [sweeping, setSweeping] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(conicReflectionNarration)
  }, [narration])

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]
  const conic = preset.conic
  // 台球模式只对椭圆有意义（另两种曲线不闭合，球一去不回）
  const effMode = mode === 'billiard' && conic.kind !== 'ellipse' ? 'single' : mode

  useEffect(() => {
    if (!sweeping) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const s = ((ts - t0) / 1000) * 0.6
      setT(conic.kind === 'ellipse' ? s % (Math.PI * 2) : Math.sin(s) * 2)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [sweeping, conic.kind])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawConicReflection(canvas, {
      conic, t, showTangent,
      showAngles: effMode === 'single',
      bounces: effMode === 'billiard' ? 9 : 0,
      rayFan: effMode === 'fan' ? 11 : 0,
    })
  }, [conic, t, showTangent, effMode])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">圆锥曲线的反射性质</h1>
            <p className="text-gray-600">入射角等于反射角，三种曲线是同一条理由</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              切线是两条焦半径的角平分线的垂线
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">
              {preset.note}。拖动滑块换反射点，左下角两个角度始终相等。
            </p>
          </div>

          <SidePanel
            presetId={presetId} t={t} mode={effMode}
            showTangent={showTangent} sweeping={sweeping}
            conic={conic}
            onPreset={setPresetId} onT={setT} onMode={setMode}
            onToggleTangent={() => setShowTangent((v) => !v)}
            onToggleSweep={() => setSweeping((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
