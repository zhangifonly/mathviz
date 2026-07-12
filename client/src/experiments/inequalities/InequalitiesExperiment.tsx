import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { inequalitiesNarration } from '../../narrations/scripts/inequalities'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { solveLinear, formatSolution, INEQUALITY_OPTIONS } from './inequalities'
import { drawInequalities } from './draw'

export default function InequalitiesExperiment() {
  const [optionId, setOptionId] = useState(INEQUALITY_OPTIONS[0].id)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(inequalitiesNarration)
  }, [narration])

  const option = INEQUALITY_OPTIONS.find((o) => o.id === optionId)!
  const solution = solveLinear(option.ineq)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawInequalities(canvas, solution, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [solution])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">不等式与数轴 ⚖️</h1>
            <p className="text-gray-600">求解一元一次不等式，并在数轴上表示解集</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{option.label} 的解集：{formatSolution(solution)}</h3>
            <canvas ref={canvasRef} width={600} height={280} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择不等式</h3>
              <div className="space-y-2">
                {INEQUALITY_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setOptionId(o.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${optionId === o.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${optionId === o.id ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点提醒</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 解不等式和解方程一样，先<b>移项</b>再<b>系数化一</b>。</li>
                <li>• 两边乘或除以<b>负数</b>时，不等号方向要<b>翻转</b>。</li>
                <li>• 边界点<b>含等号</b>画实心圆，<b>不含</b>画空心圆。</li>
                <li>• 数轴上的<b>射线</b>指向解所在的方向。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
