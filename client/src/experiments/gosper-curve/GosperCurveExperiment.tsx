import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { gosperCurveNarration } from '../../narrations/scripts/gosper-curve'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { ORDERS } from './gosperCurve'
import { drawGosperCurve } from './draw'

const W = 600
const H = 480

export default function GosperCurveExperiment() {
  const [order, setOrder] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(gosperCurveNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawGosperCurve(canvas, order)
  }, [order])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">戈斯珀曲线</h1>
            <p className="text-gray-600">六边形流水曲线</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">第 {order} 阶 · L 系统铺砌</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">迭代阶数</h3>
              <div className="space-y-2">
                {ORDERS.map((o) => (
                  <button
                    key={o}
                    onClick={() => setOrder(o)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${order === o ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    第 {o} 阶
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">规则与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 规则 <b>A→A-B--B+A++AA+B-</b>，转向角 <b>60°</b>。</li>
                <li>• 每迭代一次，前进步数变为原来的 <b>7 倍</b>。</li>
                <li>• 曲线永不自交，却能<b>填满</b>整片平面。</li>
                <li>• 它的邻域是<b>六边形</b>，故又称 Gosper 岛。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
