import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { voronoiNarration } from '../../narrations/scripts/voronoi'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { makeSites, SITE_COUNTS } from './voronoi'
import { drawVoronoi } from './draw'

const W = 600
const H = 480

export default function VoronoiExperiment() {
  const [count, setCount] = useState(16)
  const [seed, setSeed] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(voronoiNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const sites = makeSites(count, W, H, seed)
    drawVoronoi(canvas, sites, 3, true)
  }, [count, seed])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">沃罗诺伊图</h1>
            <p className="text-gray-600">最近邻划分，自然界的细胞几何</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{count} 个站点 · 最近邻分区</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">站点数量</h3>
              <div className="space-y-2">
                {SITE_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${count === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n} 个站点
                  </button>
                ))}
              </div>
              <button onClick={() => setSeed((s) => s + 1)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🎲 重新随机分布
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">应用与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 每个区域 = 离对应站点<b>最近</b>的所有点的集合。</li>
                <li>• 长颈鹿的<b>花纹</b>、蜂巢、肥皂泡都接近沃罗诺伊结构。</li>
                <li>• 手机基站覆盖、最近商店划分都用它来建模。</li>
                <li>• 它的对偶图是<b>德劳内三角剖分</b>，广泛用于网格生成。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
