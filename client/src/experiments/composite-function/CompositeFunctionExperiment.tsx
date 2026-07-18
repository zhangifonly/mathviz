import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { compositeFunctionNarration } from '../../narrations/scripts/composite-function'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FUNCTIONS, getFunc, DEMO_XS } from './compositeFunction'
import { drawCompositeFunction } from './draw'

const W = 600
const H = 480

export default function CompositeFunctionExperiment() {
  const [gKey, setGKey] = useState('sine')
  const [fKey, setFKey] = useState('square')
  const [demoIdx, setDemoIdx] = useState(2)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(compositeFunctionNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawCompositeFunction(canvas, getFunc(fKey).fn, getFunc(gKey).fn, DEMO_XS[demoIdx])
  }, [fKey, gKey, demoIdx])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">复合函数</h1>
            <p className="text-gray-600">函数的链式作用</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              <span style={{ color: '#22d3ee' }}>g</span> · <span style={{ color: '#fbbf24' }}>f</span> · <span style={{ color: '#ec4899' }}>f∘g</span>
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">内层函数 g</h3>
              <div className="space-y-2">
                {FUNCTIONS.map((fn) => (
                  <button key={fn.key} onClick={() => setGKey(fn.key)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${gKey === fn.key ? 'bg-cyan-500 text-white' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'}`}>
                    {fn.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">外层函数 f</h3>
              <div className="space-y-2">
                {FUNCTIONS.map((fn) => (
                  <button key={fn.key} onClick={() => setFKey(fn.key)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${fKey === fn.key ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>
                    {fn.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setDemoIdx((i) => (i + 1) % DEMO_XS.length)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-pink-100 text-pink-700 hover:bg-pink-200">
                ▶ 演示下一个 x 的两步映射
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
