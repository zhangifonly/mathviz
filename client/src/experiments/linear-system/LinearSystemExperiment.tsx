import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { linearSystemNarration } from '../../narrations/scripts/linear-system'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { solveLinearSystem, formatEquation, SYSTEM_OPTIONS } from './linearSystem'
import { drawLinearSystem } from './draw'

export default function LinearSystemExperiment() {
  const [systemId, setSystemId] = useState('unique')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(linearSystemNarration)
  }, [narration])

  const option = SYSTEM_OPTIONS.find((o) => o.id === systemId)!
  const solution = solveLinearSystem(option.eq1, option.eq2)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const data = { eq1: option.eq1, eq2: option.eq2, solution }
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawLinearSystem(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [systemId, option.eq1, option.eq2, solution])

  const solutionText =
    solution.type === 'unique'
      ? `唯一解 x = ${solution.x!.toFixed(2)}, y = ${solution.y!.toFixed(2)}`
      : solution.type === 'none'
        ? '无解（两线平行）'
        : '无穷多解（两线重合）'

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">二元一次方程组</h1>
            <p className="text-gray-600">两条直线的交点，就是方程组的解</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{option.label}</h3>
            <canvas ref={canvasRef} width={600} height={560} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择方程组</h3>
              <div className="space-y-2">
                {SYSTEM_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSystemId(o.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${systemId === o.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${systemId === o.id ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">当前方程组</h3>
              <div className="text-sm text-gray-700 space-y-1 font-mono">
                <div><span className="text-sky-500">直线一：</span>{formatEquation(option.eq1)}</div>
                <div><span className="text-pink-500">直线二：</span>{formatEquation(option.eq2)}</div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-sm font-medium text-amber-600">{solutionText}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">数学小贴士</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 每个方程 <b>a x + b y = c</b> 都是一条<b>直线</b>。</li>
                <li>• 两线的<b>交点</b>同时满足两个方程，就是方程组的<b>解</b>。</li>
                <li>• 相交得<b>唯一解</b>，平行则<b>无解</b>，重合有<b>无穷多解</b>。</li>
                <li>• 用行列式 <b>D = a1 b2 - a2 b1</b> 就能判断属于哪种情况。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
