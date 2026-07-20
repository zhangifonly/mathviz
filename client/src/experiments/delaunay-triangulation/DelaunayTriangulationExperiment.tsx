import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { delaunayTriangulationNarration } from '../../narrations/scripts/delaunay-triangulation'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { makePoints, POINT_COUNTS } from './delaunayTriangulation'
import { drawDelaunayTriangulation } from './draw'

const W = 600
const H = 480

export default function DelaunayTriangulationExperiment() {
  const [count, setCount] = useState(16)
  const [seed, setSeed] = useState(1)
  const [showCircle, setShowCircle] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(delaunayTriangulationNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const pts = makePoints(count, W, H, seed)
    drawDelaunayTriangulation(canvas, pts, showCircle ? 0 : -1)
  }, [count, seed, showCircle])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Delaunay三角剖分</h1>
            <p className="text-gray-600">最优三角网格</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{count} 个点 · Bowyer-Watson 剖分</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">点的数量</h3>
              <div className="space-y-2">
                {POINT_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${count === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n} 个点
                  </button>
                ))}
              </div>
              <button onClick={() => setSeed((s) => s + 1)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🎲 重新随机分布
              </button>
              <button onClick={() => setShowCircle((v) => !v)} className={`w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium ${showCircle ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}>
                {showCircle ? '隐藏外接圆' : '演示空圆性质'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">应用与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 任一三角形的<b>外接圆</b>内不含其他点，即空圆性质。</li>
                <li>• 它<b>最大化最小角</b>，避免又瘦又长的坏三角形。</li>
                <li>• 与<b>沃罗诺伊图</b>互为对偶结构。</li>
                <li>• 地形建模、有限元网格、三维重建都靠它。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
