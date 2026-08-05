import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { focusDirectrixNarration } from '../../narrations/scripts/focus-directrix'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawFocusDirectrix } from './draw'
import SidePanel from './SidePanel'
import { KIND_LABEL, classify, PRESETS } from './focusDirectrix'

const W = 640
const H = 500

export default function FocusDirectrixExperiment() {
  const [e, setE] = useState(0.5)
  const [theta, setTheta] = useState(1.1)
  const [showRatio, setShowRatio] = useState(true)
  const [sweeping, setSweeping] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(focusDirectrixNarration)
  }, [narration])

  const L = 2
  const kind = useMemo(() => classify(e), [e])

  // 扫描 θ: 让"比值不动"这件事自己演出来
  useEffect(() => {
    if (!sweeping) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      setTheta((((ts - t0) / 1000) * 0.7) % (Math.PI * 2))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [sweeping])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawFocusDirectrix(canvas, { e, l: L, theta, showRatio })
  }, [e, theta, showRatio])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">焦点准线统一定义</h1>
            <p className="text-gray-600">一条比值定出椭圆、抛物线、双曲线</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              到焦点的距离 ÷ 到准线的距离 = e，与点无关
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">
              当前是{KIND_LABEL[kind]}。拖 e 滑块穿过 1，曲线连续变形；两条测量线段的比值始终是 e。
            </p>
          </div>

          <SidePanel
            e={e} l={L} theta={theta}
            showRatio={showRatio} sweeping={sweeping}
            onE={setE} onTheta={setTheta}
            onPreset={(v) => setE(v)}
            presets={PRESETS}
            onToggleRatio={() => setShowRatio((v) => !v)}
            onToggleSweep={() => setSweeping((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
