import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { meanValueTheoremNarration } from '../../narrations/scripts/mean-value-theorem'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FUNCTIONS, INTERVALS } from './meanValueTheorem'
import { drawMeanValueTheorem } from './draw'

const W = 600
const H = 480

export default function MeanValueTheoremExperiment() {
  const [fnIdx, setFnIdx] = useState(0)
  const [ivIdx, setIvIdx] = useState(0)
  const [cs, setCs] = useState<number[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(meanValueTheoremNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const { f } = FUNCTIONS[fnIdx]
    const { a, b } = INTERVALS[ivIdx]
    setCs(drawMeanValueTheorem(canvas, f, a, b))
  }, [fnIdx, ivIdx])

  const iv = INTERVALS[ivIdx]

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">中值定理</h1>
            <p className="text-gray-600">切线平行于割线</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              {FUNCTIONS[fnIdx].label} 在 [{iv.a}, {iv.b}] 上
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            <p className="text-sm text-gray-500 mt-2">
              红=割线，绿=中值点 c 处的平行切线。找到 {cs.length} 个 c：{cs.map((c) => c.toFixed(3)).join(', ')}
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择函数</h3>
              <div className="space-y-2">
                {FUNCTIONS.map((fn, i) => (
                  <button
                    key={fn.id}
                    onClick={() => setFnIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${fnIdx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {fn.label}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mb-3 mt-4">选择区间</h3>
              <div className="space-y-2">
                {INTERVALS.map((it, i) => (
                  <button
                    key={i}
                    onClick={() => setIvIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${ivIdx === i ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                  >
                    [{it.a}, {it.b}]
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">定理要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 割线斜率就是区间上的<b>平均变化率</b>。</li>
                <li>• 曲线上<b>必有一点</b>切线与割线平行。</li>
                <li>• 该点导数 f'(c) = (f(b)-f(a))/(b-a)。</li>
                <li>• 当 f(a)=f(b) 时退化为<b>罗尔定理</b>：f'(c)=0。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
