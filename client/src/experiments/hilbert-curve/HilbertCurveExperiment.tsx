import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { hilbertCurveNarration } from '../../narrations/scripts/hilbert-curve'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { ORDERS } from './hilbertCurve'
import { drawHilbertCurve } from './draw'

const W = 600
const H = 480

export default function HilbertCurveExperiment() {
  const [order, setOrder] = useState(4)
  const [showDots, setShowDots] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(hilbertCurveNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawHilbertCurve(canvas, order, showDots)
  }, [order, showDots])

  const total = (1 << order) * (1 << order)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">希尔伯特曲线</h1>
            <p className="text-gray-600">空间填充与邻近保持</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{order} 阶 · 遍历 {total} 个格子</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">曲线阶数</h3>
              <div className="space-y-2">
                {ORDERS.map((o) => (
                  <button
                    key={o}
                    onClick={() => setOrder(o)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${order === o ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {o} 阶（{1 << o}×{1 << o} 网格）
                  </button>
                ))}
              </div>
              <button onClick={() => setShowDots((d) => !d)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                {showDots ? '隐藏折点' : '显示折点'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">应用与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 一条曲线不重复地<b>填满</b>整个正方形网格。</li>
                <li>• 遍历顺序上相近的点，在平面上也<b>彼此靠近</b>。</li>
                <li>• 图像压缩、数据库<b>空间索引</b>常用它给二维数据排序。</li>
                <li>• 地理信息系统里用它把经纬度编码成一维键。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
