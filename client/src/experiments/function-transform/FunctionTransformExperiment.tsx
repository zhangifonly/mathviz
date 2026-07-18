import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { functionTransformNarration } from '../../narrations/scripts/function-transform'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { getBase, describe, BASES } from './functionTransform'
import { drawFunctionTransform } from './draw'

const W = 600
const H = 480

type Key = 'a' | 'b' | 'h' | 'k'
const SLIDERS: { key: Key; label: string; min: number; max: number; step: number }[] = [
  { key: 'a', label: 'a 竖直伸缩/翻折', min: -2, max: 2, step: 0.5 },
  { key: 'b', label: 'b 水平伸缩/翻折', min: -2, max: 2, step: 0.5 },
  { key: 'h', label: 'h 水平平移', min: -3, max: 3, step: 0.5 },
  { key: 'k', label: 'k 竖直平移', min: -3, max: 3, step: 0.5 },
]

export default function FunctionTransformExperiment() {
  const [baseKey, setBaseKey] = useState('square')
  const [t, setT] = useState({ a: 1, b: 1, h: 0, k: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(functionTransformNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawFunctionTransform(canvas, getBase(baseKey).fn, t)
  }, [baseKey, t])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">函数图象变换</h1>
            <p className="text-gray-600">平移伸缩翻折</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">g(x) = a·f(b(x−h)) + k · <span className="text-indigo-600">{describe(t)}</span></h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">基函数 f(x)</h3>
              <div className="grid grid-cols-2 gap-2">
                {BASES.map((b) => (
                  <button key={b.key} onClick={() => setBaseKey(b.key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${baseKey === b.key ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">四个参数</h3>
              <div className="space-y-3">
                {SLIDERS.map((s) => (
                  <div key={s.key}>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{s.label}</span><b>{t[s.key]}</b>
                    </div>
                    <input type="range" min={s.min} max={s.max} step={s.step} value={t[s.key]}
                      onChange={(e) => setT({ ...t, [s.key]: Number(e.target.value) })}
                      className="w-full accent-indigo-500" />
                  </div>
                ))}
              </div>
              <button onClick={() => setT({ a: 1, b: 1, h: 0, k: 0 })}
                className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                ↺ 重置为基函数
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
