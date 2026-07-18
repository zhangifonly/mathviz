import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { improperIntegralNarration } from '../../narrations/scripts/improper-integral'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FUNCTIONS, MAX_T, START_A, integrate, isConverging } from './improperIntegral'
import { drawImproperIntegral } from './draw'

const W = 600
const H = 480

export default function ImproperIntegralExperiment() {
  const [fnKey, setFnKey] = useState(FUNCTIONS[0].key)
  const [upper, setUpper] = useState(8)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const info = FUNCTIONS.find((f) => f.key === fnKey) ?? FUNCTIONS[0]

  useEffect(() => {
    if (narration) narration.loadScript(improperIntegralNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawImproperIntegral(canvas, info.fn, upper, MAX_T)
  }, [info, upper])

  const area = integrate(info.fn, START_A, upper, 2000)
  const converged = info.converges && isConverging([area, integrate(info.fn, START_A, upper + 4, 2000)])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">反常积分</h1>
            <p className="text-gray-600">无穷区间与无界函数</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">∫ 从 {START_A} 到 T 的 {info.label} dx</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">被积函数</h3>
              <div className="space-y-2">
                {FUNCTIONS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFnKey(f.key)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${fnKey === f.key ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {f.label} {f.converges ? '（收敛）' : '（发散）'}
                  </button>
                ))}
              </div>
              <h3 className="text-sm font-semibold mt-4 mb-2">积分上限 T = {upper.toFixed(1)}</h3>
              <input
                type="range" min={2} max={MAX_T} step={0.5} value={upper}
                onChange={(e) => setUpper(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">当前面积</h3>
              <p className="text-2xl font-bold text-indigo-600">{area.toFixed(4)}</p>
              <p className={`text-sm mt-1 ${info.converges ? 'text-emerald-600' : 'text-rose-600'}`}>
                {info.converges ? `T→∞ 收敛到 ${info.value?.toFixed(4)}` : 'T→∞ 面积无限增长，发散'}
                {converged ? ' · 已接近极限' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
