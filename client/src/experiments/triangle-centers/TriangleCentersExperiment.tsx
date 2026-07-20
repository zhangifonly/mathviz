import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { triangleCentersNarration } from '../../narrations/scripts/triangle-centers'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { PRESET_TRIANGLES } from './triangleCenters'
import { drawTriangleCenters, CENTERS } from './draw'

const W = 600
const H = 480

export default function TriangleCentersExperiment() {
  const [idx, setIdx] = useState(0)
  const [showCircum, setShowCircum] = useState(true)
  const [showIn, setShowIn] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(triangleCentersNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawTriangleCenters(canvas, PRESET_TRIANGLES[idx], { showCircum, showIn })
  }, [idx, showCircum, showIn])

  const labels = ['锐角三角形', '钝角三角形', '直角三角形']

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">三角形四心</h1>
            <p className="text-gray-600">重心、外心、内心、垂心</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{labels[idx]} · 四心与内外接圆</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择三角形</h3>
              <div className="space-y-2">
                {labels.map((n, i) => (
                  <button
                    key={n}
                    onClick={() => setIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 mt-3 text-sm text-gray-700">
                <input type="checkbox" checked={showCircum} onChange={(e) => setShowCircum(e.target.checked)} />
                显示外接圆
              </label>
              <label className="flex items-center gap-2 mt-2 text-sm text-gray-700">
                <input type="checkbox" checked={showIn} onChange={(e) => setShowIn(e.target.checked)} />
                显示内切圆
              </label>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">四心图例</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                {Object.values(CENTERS).map((c) => (
                  <li key={c.label} className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: c.color }} />
                    {c.label}
                  </li>
                ))}
                <li>• 重心、外心、垂心三点共线（欧拉线）。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
