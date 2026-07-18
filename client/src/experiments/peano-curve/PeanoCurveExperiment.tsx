import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { peanoCurveNarration } from '../../narrations/scripts/peano-curve'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { ORDERS, pointCount } from './peanoCurve'
import { drawPeanoCurve } from './draw'

const W = 600
const H = 480

export default function PeanoCurveExperiment() {
  const [order, setOrder] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(peanoCurveNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPeanoCurve(canvas, order, 1)
  }, [order])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">皮亚诺曲线</h1>
            <p className="text-gray-600">最早的空间填充曲线</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{order} 阶 · 共 {pointCount(order)} 个格点</h3>
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
                    {o} 阶（{Math.pow(3, o)}×{Math.pow(3, o)} 网格）
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">颜色从蓝到红表示走过的先后顺序，绿点是起点、红点是终点。</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">关于皮亚诺曲线</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 1890 年皮亚诺给出的<b>第一条空间填充曲线</b>。</li>
                <li>• 基于三进制、<b>3×3 自相似</b>递归生成。</li>
                <li>• 它<b>处处连续，却处处不可导</b>。</li>
                <li>• 阶数趋于无穷时，曲线<b>填满整个正方形</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
