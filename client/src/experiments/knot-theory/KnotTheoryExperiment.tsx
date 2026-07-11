import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { knotTheoryNarration } from '../../narrations/scripts/knot-theory'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { knotCurve, KNOT_OPTIONS } from './knotTheory'
import { drawKnotTheory } from './draw'

export default function KnotTheoryExperiment() {
  const [knotId, setKnotId] = useState('trefoil')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(knotTheoryNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const pts = knotCurve(knotId, 500)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.005)
      drawKnotTheory(canvas, pts, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [knotId])

  const info = KNOT_OPTIONS.find((k) => k.id === knotId)!

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">纽结理论</h1>
            <p className="text-gray-600">用交叉数、亏格与琼斯多项式分辨打结的绳圈</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.name} · {info.symbol}</h3>
            <canvas ref={canvasRef} width={600} height={540} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择纽结</h3>
              <div className="space-y-2">
                {KNOT_OPTIONS.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => setKnotId(k.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${knotId === k.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{k.name} ({k.symbol})</div>
                    <div className={`text-xs ${knotId === k.id ? 'text-indigo-100' : 'text-indigo-400'}`}>{k.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">不变量</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 交叉数：<b>{info.crossingNumber}</b>，投影中最少的上下穿越数。</li>
                <li>• 亏格：<b>{info.genus}</b>，填补纽结所需曲面的复杂度。</li>
                <li>• 琼斯多项式在变量取 1 时<b>恒等于 1</b>，是判别纽结的强力工具。</li>
                <li>• 环面纽结 T(p,q) 缠绕在甜甜圈表面，亏格 =(p-1)(q-1)/2。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
