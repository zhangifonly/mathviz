import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { fareySequenceNarration } from '../../narrations/scripts/farey-sequence'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { farey, ORDERS } from './fareySequence'
import { drawFareySequence } from './draw'

const W = 600
const H = 480

export default function FareySequenceExperiment() {
  const [order, setOrder] = useState(5)
  const [showCircles, setShowCircles] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(fareySequenceNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawFareySequence(canvas, order, showCircles)
  }, [order, showCircles])

  const seq = farey(order)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">法里数列</h1>
            <p className="text-gray-600">既约分数的排列</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">F{order} · 共 {seq.length} 个既约分数</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">阶数 n</h3>
              <div className="space-y-2">
                {ORDERS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setOrder(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${order === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    F{n}（分母 ≤ {n}）
                  </button>
                ))}
              </div>
              <button onClick={() => setShowCircles((v) => !v)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                {showCircles ? '隐藏福特圆' : '显示福特圆'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">关键性质</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• F<sub>n</sub> 是分母 ≤ n 的 [0,1] <b>既约分数</b>升序列表。</li>
                <li>• 相邻 a/b、c/d 满足 <b>bc − ad = 1</b>。</li>
                <li>• 下一阶新增项恰是相邻项的<b>中位数</b> (a+c)/(b+d)。</li>
                <li>• 每个分数对应一个<b>福特圆</b>，相邻分数的圆彼此相切。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
