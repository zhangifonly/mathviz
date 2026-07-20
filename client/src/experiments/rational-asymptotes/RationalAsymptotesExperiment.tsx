import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { rationalAsymptotesNarration } from '../../narrations/scripts/rational-asymptotes'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { RATIONAL_EXAMPLES, verticalAsymptotes, horizontalOrOblique } from './rationalAsymptotes'
import { drawRationalAsymptotes } from './draw'

const W = 600
const H = 480

export default function RationalAsymptotesExperiment() {
  const [idx, setIdx] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(rationalAsymptotesNarration)
  }, [narration])

  const ex = RATIONAL_EXAMPLES[idx]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawRationalAsymptotes(canvas, ex.num, ex.den)
  }, [ex])

  const vAsy = verticalAsymptotes(ex.den)
  const end = horizontalOrOblique(ex.num, ex.den)
  const endText = end.kind === 'horizontal'
    ? `水平渐近线 y = ${end.intercept.toFixed(2)}`
    : end.kind === 'oblique'
      ? `斜渐近线 y = ${end.slope.toFixed(2)}x + ${end.intercept.toFixed(2)}`
      : '无末端渐近线'

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">有理函数与渐近线</h1>
            <p className="text-gray-600">曲线的无限逼近</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">f(x) = {ex.label}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择例子</h3>
              <div className="space-y-2">
                {RATIONAL_EXAMPLES.map((e, i) => (
                  <button
                    key={e.key}
                    onClick={() => setIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">渐近线分析</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• <span className="text-red-500 font-medium">竖直渐近线</span>：{vAsy.length ? vAsy.map((a) => `x = ${a.toFixed(2)}`).join('，') : '无'}</li>
                <li>• <span className="text-blue-500 font-medium">{endText}</span></li>
                <li>• 竖直渐近线来自<b>分母的根</b>。</li>
                <li>• 末端渐近线由<b>分子分母次数比较</b>决定。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
