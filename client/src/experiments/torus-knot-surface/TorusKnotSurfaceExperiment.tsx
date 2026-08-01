import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { torusKnotSurfaceNarration } from '../../narrations/scripts/torus-knot-surface'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawTorusKnot } from './draw'
import {
  gcd, isKnot, crossingNumber, seifertGenus, bridgeNumber, isSymmetricPair,
  KNOT_TABLE,
} from './torusKnotSurface'

const W = 640
const H = 480

export default function TorusKnotSurfaceExperiment() {
  const [p, setP] = useState(2)
  const [q, setQ] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(torusKnotSurfaceNarration)
  }, [narration])

  // 用 Canvas 而非 Plotly: 管面沿 Frenet 标架生成, 且要按弧长着色
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const el = (ts - start) / 1000
      drawTorusKnot(canvas, { p, q, showInvariants: true, yaw: 0.6 + el * 0.24 })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [p, q])

  const knot = isKnot(p, q)
  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">环面纽结管</h1>
            <p className="text-gray-600">两个整数决定一个纽结</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">({p},{q}) · {knot ? '纽结' : `链环，${gcd(p, q)} 个分支`}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">经线圈数 p：{p}</h3>
              <input type="range" min={2} max={5} step={1} value={p}
                onChange={(e) => setP(Number(e.target.value))}
                className="w-full" aria-label="经线圈数" />
              <h3 className="text-lg font-semibold mb-2 mt-3">纬线圈数 q：{q}</h3>
              <input type="range" min={2} max={8} step={1} value={q}
                onChange={(e) => setQ(Number(e.target.value))}
                className="w-full" aria-label="纬线圈数" />
              <div className="mt-3 space-y-2">
                {KNOT_TABLE.map((k) => (
                  <button key={k.label} onClick={() => { setP(k.p); setQ(k.q) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between ${p === k.p && q === k.q ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    <span>{k.label}</span><span className="text-xs opacity-70">{k.note}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">不变量（直接由 p,q 算出）</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 分支数 gcd({p},{q}) = <b>{gcd(p, q)}</b>{knot ? '，互素故为纽结' : '，不互素故为链环'}</li>
                {knot && <li>• 交叉数 <b>{crossingNumber(p, q)}</b> = min(p(q−1), q(p−1))</li>}
                {knot && <li>• Seifert 亏格 <b>{seifertGenus(p, q)}</b> = (p−1)(q−1)/2</li>}
                {knot && <li>• 桥数 <b>{bridgeNumber(p, q)}</b> = min(p, q)</li>}
                {knot && <li>• 交换 p,q 后不变量{isSymmetricPair(p, q) ? '全相同' : '有差异'}，故 (p,q) 与 (q,p) 是<b>同一纽结</b></li>}
                {!knot && <li>• 三个公式对链环<b>不适用</b>，需换用链环的不变量。</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
