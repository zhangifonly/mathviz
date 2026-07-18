import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { stereographicProjectionNarration } from '../../narrations/scripts/stereographic-projection'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawStereographicProjection } from './draw'

const W = 600
const H = 480

export default function StereographicProjectionExperiment() {
  const [rot, setRot] = useState(0.3)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(stereographicProjectionNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawStereographicProjection(canvas, rot)
  }, [rot])

  const deg = Math.round((rot * 180) / Math.PI)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">球极投影</h1>
            <p className="text-gray-600">保角的球面到平面映射</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">左：球面网格 · 右：投到平面的像</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">旋转球面 · {deg}°</h3>
              <input
                type="range"
                min={0}
                max={628}
                value={Math.round(rot * 100)}
                onChange={(e) => setRot(Number(e.target.value) / 100)}
                className="w-full"
              />
              <button onClick={() => setRot(0.3)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🔄 复位视角
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 从<b>北极</b>把球面点投到赤道平面：<b>(X,Y)=(x/(1-z), y/(1-z))</b>。</li>
                <li>• 它是<b>保角</b>映射，任意两曲线的夹角在投影后保持不变。</li>
                <li>• 球面上的圆映射成平面上的<b>圆或直线</b>。</li>
                <li>• 纬线变<b>同心圆</b>，经线变<b>过原点的放射线</b>。</li>
                <li>• 地图学、复分析里的黎曼球面都用到它。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
