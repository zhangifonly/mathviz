import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { pythagoreanTriplesNarration } from '../../narrations/scripts/pythagorean-triples'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { primitiveTriples, LIMIT_OPTIONS, type Triple } from './pythagoreanTriples'
import { drawPythagoreanTriples } from './draw'

const W = 600
const H = 480

export default function PythagoreanTriplesExperiment() {
  const [limit, setLimit] = useState(120)
  const [picked, setPicked] = useState<Triple | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(pythagoreanTriplesNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPythagoreanTriples(canvas, limit, picked)
  }, [limit, picked])

  const triples = primitiveTriples(limit)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">勾股数</h1>
            <p className="text-gray-600">整数直角三角形</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">本原勾股数 (a, b) 散点分布</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">斜边上限 c</h3>
              <div className="space-y-2">
                {LIMIT_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => { setLimit(n); setPicked(null) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${limit === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    c ≤ {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">前几组（点击高亮）</h3>
              <div className="flex flex-wrap gap-1.5">
                {triples.slice(0, 12).map((t) => (
                  <button
                    key={`${t.a}-${t.b}-${t.c}`}
                    onClick={() => setPicked(t)}
                    className="px-2 py-1 rounded text-xs font-mono bg-purple-100 text-purple-700 hover:bg-purple-200"
                  >
                    {t.a},{t.b},{t.c}
                  </button>
                ))}
              </div>
              <ul className="text-sm text-gray-600 space-y-1.5 mt-3">
                <li>• 欧几里得公式：a=m²-n²，b=2mn，c=m²+n²。</li>
                <li>• m,n 互质且一奇一偶时得<b>本原</b>勾股数。</li>
                <li>• 每组乘以整数 k 就得到无穷多<b>派生</b>解。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
