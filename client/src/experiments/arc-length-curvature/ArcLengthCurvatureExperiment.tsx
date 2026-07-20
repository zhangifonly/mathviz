import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { arcLengthCurvatureNarration } from '../../narrations/scripts/arc-length-curvature'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { CURVES, arcLength, curvature, radiusOfCurvature } from './arcLengthCurvature'
import { drawArcLengthCurvature } from './draw'

const W = 600
const H = 480

export default function ArcLengthCurvatureExperiment() {
  const [curveIdx, setCurveIdx] = useState(1)
  const [t, setT] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(arcLengthCurvatureNarration)
  }, [narration])

  const curve = CURVES[curveIdx]
  const tClamped = Math.max(curve.tMin, Math.min(curve.tMax, t))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawArcLengthCurvature(canvas, curve, tClamped)
  }, [curve, tClamped])

  const kappa = curvature(curve, tClamped)
  const rad = radiusOfCurvature(curve, tClamped)
  const total = arcLength(curve, curve.tMin, curve.tMax)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">弧长与曲率</h1>
            <p className="text-gray-600">曲线的长度与弯曲</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{curve.name} · 密切圆与切法向</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择曲线</h3>
              <div className="space-y-2">
                {CURVES.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => { setCurveIdx(i); setT((c.tMin + c.tMax) / 2) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${curveIdx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              <label className="block text-sm text-gray-600 mt-4 mb-1">移动点 t = {tClamped.toFixed(2)}</label>
              <input type="range" min={curve.tMin} max={curve.tMax} step={0.02} value={tClamped}
                onChange={(e) => setT(parseFloat(e.target.value))} className="w-full" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">实时读数</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 曲率 κ = <b>{kappa.toFixed(3)}</b></li>
                <li>• 曲率半径 1/κ = <b>{isFinite(rad) ? rad.toFixed(2) : '∞'}</b></li>
                <li>• 全曲线弧长 ≈ <b>{total.toFixed(2)}</b></li>
                <li>• <span className="text-pink-500">粉圆</span>是密切圆，<span className="text-green-500">绿</span>为切向、<span className="text-amber-500">橙</span>为法向。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
