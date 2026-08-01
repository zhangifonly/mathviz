import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { trefoilSurfaceNarration } from '../../narrations/scripts/trefoil-surface'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawTrefoil } from './draw'
import {
  gcd, isKnot, alexanderAt, countProjectionCrossings, ALEXANDER_TREFOIL,
  KNOT_PRESETS,
} from './trefoilSurface'

const W = 640
const H = 480

export default function TrefoilSurfaceExperiment() {
  const [p, setP] = useState(2)
  const [q, setQ] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(trefoilSurfaceNarration)
  }, [narration])

  // 用 Canvas 而非 Plotly: 管面要沿 Frenet 标架生成, 且需按弧长着色
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const el = (ts - start) / 1000
      drawTrefoil(canvas, { p, q, showInfo: true, yaw: 0.6 + el * 0.26 })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [p, q])

  const isTrefoil = p === 2 && q === 3
  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">三叶结曲面</h1>
            <p className="text-gray-600">最简单的非平凡纽结</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">({p},{q}) · {isKnot(p, q) ? '纽结' : '链环'}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">经线圈数 p：{p}</h3>
              <input type="range" min={2} max={5} step={1} value={p}
                onChange={(e) => setP(Number(e.target.value))}
                className="w-full" aria-label="经线圈数" />
              <h3 className="text-lg font-semibold mb-2 mt-3">纬线圈数 q：{q}</h3>
              <input type="range" min={2} max={7} step={1} value={q}
                onChange={(e) => setQ(Number(e.target.value))}
                className="w-full" aria-label="纬线圈数" />
              <div className="mt-3 space-y-2">
                {KNOT_PRESETS.map((k) => (
                  <button key={k.label} onClick={() => { setP(k.p); setQ(k.q) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between ${p === k.p && q === k.q ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    <span>{k.label}</span><span className="text-xs opacity-70">{k.note}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">不变量与判据</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• gcd({p},{q}) = <b>{gcd(p, q)}</b> → {isKnot(p, q) ? '互素，是纽结' : '不互素，是链环'}</li>
                {isTrefoil && <li>• 投影交叉数 <b>{countProjectionCrossings(1200)}</b>（非平凡纽结的最小值）</li>}
                {isTrefoil && <li>• Δ(2) = <b>{alexanderAt(ALEXANDER_TREFOIL, 2)}</b> ≠ 1，严格证明打不开</li>}
                <li>• <b>交叉数</b>是纽结不变量：连续变形不改变它。</li>
                <li>• <b>t=1 处两个多项式都等于 1</b>，必须换点取值才能区分纽结。</li>
                <li>• 三叶结有<b>左右手两版</b>，镜像对称却无法互变。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
