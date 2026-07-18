import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { earClippingNarration } from '../../narrations/scripts/ear-clipping'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { earClipping, POLYGONS, POLYGON_NAMES } from './earClipping'
import { drawEarClipping } from './draw'

const W = 600
const H = 480
const SCALE = 1.15

export default function EarClippingExperiment() {
  const [polyName, setPolyName] = useState(POLYGON_NAMES[0])
  const [step, setStep] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const polygon = POLYGONS[polyName]
  const total = earClipping(polygon).triangles.length
  const shown = Math.min(step, total)

  useEffect(() => {
    if (narration) narration.loadScript(earClippingNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawEarClipping(canvas, polygon, shown, SCALE)
  }, [polygon, shown])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">耳切三角剖分</h1>
            <p className="text-gray-600">简单多边形三角化</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">已切下 {shown} / {total} 个三角形</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择多边形</h3>
              <div className="space-y-2">
                {POLYGON_NAMES.map((n) => (
                  <button
                    key={n}
                    onClick={() => { setPolyName(n); setStep(0) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${polyName === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setStep((s) => Math.min(s + 1, total))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                  ✂️ 单步切耳
                </button>
                <button onClick={() => setStep(0)} className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                  重置
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• <b>耳朵</b> = 凸顶点，且其三角形内不含其他顶点。</li>
                <li>• 每切一只耳，多边形<b>少一个顶点</b>。</li>
                <li>• n 边简单多边形恰好切成 <b>n-2</b> 个三角形。</li>
                <li>• 任何简单多边形<b>至少有两只耳</b>（双耳定理）。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
