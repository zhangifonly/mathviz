import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { dotCrossProductNarration } from '../../narrations/scripts/dot-cross-product'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import {
  dot,
  cross,
  magnitude,
  angleBetween,
  parallelogramArea,
  DOT_CROSS_OPTIONS,
} from './dotCrossProduct'
import { drawDotCrossProduct, type DrawMode } from './draw'

export default function DotCrossProductExperiment() {
  const [pairId, setPairId] = useState(DOT_CROSS_OPTIONS[1].id)
  const [mode, setMode] = useState<DrawMode>('dot')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(dotCrossProductNarration)
  }, [narration])

  const option = DOT_CROSS_OPTIONS.find((o) => o.id === pairId) ?? DOT_CROSS_OPTIONS[1]
  const { a, b } = option

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawDotCrossProduct(canvas, { a, b, mode }, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [a, b, mode])

  const dotVal = dot(a, b)
  const crossVec = cross(a, b)
  const area = parallelogramArea(a, b)
  const angleDeg = (angleBetween(a, b) * 180) / Math.PI

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">点积与叉积</h1>
            <p className="text-gray-600">两种向量乘法背后的几何意义</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{mode === 'dot' ? '点积 · 投影可视化' : '叉积 · 平行四边形面积'}</h3>
            <canvas ref={canvasRef} width={600} height={520} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">可视化模式</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('dot')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${mode === 'dot' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                >
                  点积（投影）
                </button>
                <button
                  onClick={() => setMode('cross')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${mode === 'cross' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                >
                  叉积（面积）
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择向量对</h3>
              <div className="space-y-2">
                {DOT_CROSS_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setPairId(o.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${pairId === o.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${pairId === o.id ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">实时数值</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>a = ({a.x}, {a.y})，|a| = {magnitude(a).toFixed(2)}</li>
                <li>b = ({b.x}, {b.y})，|b| = {magnitude(b).toFixed(2)}</li>
                <li>夹角 θ ≈ {angleDeg.toFixed(1)}°</li>
                <li>点积 a·b = <b>{dotVal.toFixed(2)}</b></li>
                <li>叉积 z 分量 = <b>{crossVec.z.toFixed(2)}</b></li>
                <li>平行四边形面积 = <b>{area.toFixed(2)}</b></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
