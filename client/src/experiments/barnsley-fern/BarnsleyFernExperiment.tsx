import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { barnsleyFernNarration } from '../../narrations/scripts/barnsley-fern'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FERN_TRANSFORMS, POINT_COUNTS } from './barnsleyFern'
import { drawBarnsleyFern } from './draw'

const W = 600
const H = 480

export default function BarnsleyFernExperiment() {
  const [count, setCount] = useState(50000)
  const [highlight, setHighlight] = useState(-1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(barnsleyFernNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawBarnsleyFern(canvas, count, 1, highlight)
  }, [count, highlight])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">巴恩斯利蕨</h1>
            <p className="text-gray-600">迭代函数系统</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{count.toLocaleString()} 个迭代点 · 数学画出的蕨</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">迭代点数</h3>
              <div className="space-y-2">
                {POINT_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${count === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n.toLocaleString()} 个点
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">高亮某个变换</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setHighlight(-1)} className={`px-2 py-2 rounded-lg text-sm font-medium ${highlight === -1 ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>全部</button>
                {FERN_TRANSFORMS.map((t, i) => (
                  <button key={t.name} onClick={() => setHighlight(i)} className={`px-2 py-2 rounded-lg text-sm font-medium ${highlight === i ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                    {t.name} {(t.p * 100).toFixed(0)}%
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">背后的数学</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 4 个<b>仿射变换</b>按概率随机选取，反复迭代。</li>
                <li>• 概率最大的<b>主叶</b>变换负责收缩旋转出整片叶形。</li>
                <li>• 概率仅 1% 的<b>茎</b>变换把点压向 y 轴，画出主干。</li>
                <li>• 这是<b>迭代函数系统</b>生成分形的经典范例。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
