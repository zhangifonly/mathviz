import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { multipleIntegralNarration } from '../../narrations/scripts/multiple-integral'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { doubleIntegral, FUNCTIONS, DOMAINS, GRID_SIZES } from './multipleIntegral'
import { drawMultipleIntegral } from './draw'

const W = 600
const H = 480

export default function MultipleIntegralExperiment() {
  const [fnIdx, setFnIdx] = useState(0)
  const [domIdx, setDomIdx] = useState(0)
  const [n, setN] = useState(8)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const fn = FUNCTIONS[fnIdx]
  const dom = DOMAINS[domIdx]
  const { volume } = doubleIntegral(fn.f, dom.xa, dom.xb, dom.ya, dom.yb, n)

  useEffect(() => {
    if (narration) narration.loadScript(multipleIntegralNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawMultipleIntegral(canvas, fn.f, dom.xa, dom.xb, dom.ya, dom.yb, n)
  }, [fn, dom, n])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">重积分</h1>
            <p className="text-gray-600">二重积分求体积</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{n}×{n} 网格 · 近似体积 ≈ {volume.toFixed(4)}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            <p className="text-xs text-gray-500 mt-2">颜色越暖表示 f(x,y) 越大，即黎曼和中越高的柱子。</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">被积函数</h3>
              <div className="space-y-2">
                {FUNCTIONS.map((f, i) => (
                  <button key={f.id} onClick={() => setFnIdx(i)} className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-left ${fnIdx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">积分区域</h3>
              <div className="space-y-2">
                {DOMAINS.map((d, i) => (
                  <button key={d.id} onClick={() => setDomIdx(i)} className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-left ${domIdx === i ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">网格密度 n</h3>
              <div className="grid grid-cols-4 gap-2">
                {GRID_SIZES.map((g) => (
                  <button key={g} onClick={() => setN(g)} className={`px-2 py-2 rounded-lg text-sm font-medium ${n === g ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                    {g}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">n 越大，网格中点法的黎曼和越接近真实体积。</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
