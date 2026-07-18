import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { riemannSumNarration } from '../../narrations/scripts/riemann-sum'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FUNCTIONS, MODES, N_VALUES, type RiemannMode } from './riemannSum'
import { drawRiemannSum } from './draw'

const W = 600
const H = 480
const MODE_LABEL: Record<RiemannMode, string> = { left: '左端点', right: '右端点', mid: '中点' }

export default function RiemannSumExperiment() {
  const [fnKey, setFnKey] = useState(FUNCTIONS[0].key)
  const [n, setN] = useState(8)
  const [mode, setMode] = useState<RiemannMode>('mid')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(riemannSumNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const def = FUNCTIONS.find((f) => f.key === fnKey) ?? FUNCTIONS[0]
    drawRiemannSum(canvas, def, n, mode)
  }, [fnKey, n, mode])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">黎曼和</h1>
            <p className="text-gray-600">矩形逼近曲线下面积</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">n = {n} · {MODE_LABEL[mode]}取样</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择函数</h3>
              <div className="space-y-2">
                {FUNCTIONS.map((f) => (
                  <button key={f.key} onClick={() => setFnKey(f.key)} className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${fnKey === f.key ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">分段数 n</h3>
              <div className="grid grid-cols-4 gap-2">
                {N_VALUES.map((v) => (
                  <button key={v} onClick={() => setN(v)} className={`px-2 py-2 rounded-lg text-sm font-medium ${n === v ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">取样方式</h3>
              <div className="grid grid-cols-3 gap-2">
                {MODES.map((m) => (
                  <button key={m} onClick={() => setMode(m)} className={`px-2 py-2 rounded-lg text-sm font-medium ${mode === m ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                    {MODE_LABEL[m]}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">增大 n 或改用中点取样，观察误差如何变小。</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
