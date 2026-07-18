import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { sphericalGeometryNarration } from '../../narrations/scripts/spherical-geometry'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { PRESET_POINTS, PRESET_KEYS, toVec3, sphericalTriangleAngleSum } from './sphericalGeometry'
import { drawSphericalGeometry } from './draw'

const W = 600
const H = 480
const LABELS: Record<string, string> = { octant: '八分之一球面（270°）', cities: '北京·纽约·开普敦', wide: '横跨半球的大三角形' }

export default function SphericalGeometryExperiment() {
  const [preset, setPreset] = useState('octant')
  const [rot, setRot] = useState(0.5)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(sphericalGeometryNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawSphericalGeometry(canvas, PRESET_POINTS[preset], rot, true)
  }, [preset, rot])

  const pts = PRESET_POINTS[preset]
  const [a, b, c] = pts.map((p) => toVec3(p.lat, p.lon))
  const sum = sphericalTriangleAngleSum(a, b, c)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">球面几何</h1>
            <p className="text-gray-600">大圆与球面三角形</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{LABELS[preset]} · 内角和 {sum.toFixed(1)}°</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择球面三角形</h3>
              <div className="space-y-2">
                {PRESET_KEYS.map((k) => (
                  <button
                    key={k}
                    onClick={() => setPreset(k)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${preset === k ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {LABELS[k]}
                  </button>
                ))}
              </div>
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">旋转地球 {(rot * 57.3).toFixed(0)}°</label>
              <input type="range" min={0} max={6.28} step={0.02} value={rot} onChange={(e) => setRot(Number(e.target.value))} className="w-full" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 球面上的<b>直线</b>是大圆，也是两点<b>最短路径</b>。</li>
                <li>• 球面三角形内角和<b>大于180°</b>，随三角形增大而增大。</li>
                <li>• <b>球面盈余</b>=内角和-180°，乘 R² 恰好等于三角形面积。</li>
                <li>• 这正是<b>非欧几何</b>与平面几何的根本差异。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
