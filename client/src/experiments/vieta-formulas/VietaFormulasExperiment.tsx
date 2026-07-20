import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { vietaFormulasNarration } from '../../narrations/scripts/vieta-formulas'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLE_ROOTS, rootsToCoeffs, vietaCheck } from './vietaFormulas'
import { drawVietaFormulas } from './draw'

const W = 600
const H = 480

export default function VietaFormulasExperiment() {
  const [idx, setIdx] = useState(2)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const roots = SAMPLE_ROOTS[idx]
  const coeffs = rootsToCoeffs(roots)
  const check = vietaCheck(roots)

  useEffect(() => {
    if (narration) narration.loadScript(vietaFormulasNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawVietaFormulas(canvas, roots)
  }, [roots])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">韦达定理</h1>
            <p className="text-gray-600">根与系数的对称关系</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{roots.length} 次多项式 · {roots.length} 个根</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择一组根</h3>
              <div className="space-y-2">
                {SAMPLE_ROOTS.map((rs, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    根 = {'{'} {rs.join(', ')} {'}'}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">根与系数</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 首一多项式系数（升幂）：[{coeffs.join(', ')}]</li>
                <li>• 根之和 = <b>{check.sum}</b>，而 -a<sub>n-1</sub>/a<sub>n</sub> = <b>{check.sumFromCoeffs}</b></li>
                <li>• 根之积 = <b>{check.product}</b>，而 (-1)<sup>n</sup>a<sub>0</sub>/a<sub>n</sub> = <b>{check.productFromCoeffs}</b></li>
                <li>• 二次特例：和 = -b/a，积 = c/a。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
