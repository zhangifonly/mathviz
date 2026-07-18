import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { levyCCurveNarration } from '../../narrations/scripts/levy-c-curve'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { ORDERS, segmentCount } from './levyCCurve'
import { drawLevyCCurve } from './draw'

const W = 600
const H = 480

export default function LevyCCurveExperiment() {
  const [order, setOrder] = useState(12)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(levyCCurveNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawLevyCCurve(canvas, order)
  }, [order])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">列维C形曲线</h1>
            <p className="text-gray-600">直角自相似分形</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{order} 阶 · {segmentCount(order)} 条线段</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">递归阶数</h3>
              <div className="space-y-2">
                {ORDERS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setOrder(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${order === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n} 阶
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">关于列维曲线</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 每条线段被替换成<b>两条直角边</b>，构成等腰直角三角形。</li>
                <li>• 每提升一阶，线段数<b>翻倍</b>，无数个 C 字层层嵌套。</li>
                <li>• 局部与整体形状相同，是典型的<b>自相似</b>分形。</li>
                <li>• 其分形维数约为 <b>2</b>，曲线几乎填满一片区域。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
