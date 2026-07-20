import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { pellEquationNarration } from '../../narrations/scripts/pell-equation'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { fundamentalSolution, generateSolutions, NS } from './pellEquation'
import { drawPellEquation } from './draw'

const W = 600
const H = 480

export default function PellEquationExperiment() {
  const [n, setN] = useState(2)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(pellEquationNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPellEquation(canvas, n, 3)
  }, [n])

  const base = fundamentalSolution(n)
  const sols = generateSolutions(n, 3)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">佩尔方程</h1>
            <p className="text-gray-600">x²-Ny²=1的整数解</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">双曲线 x²-{n}y²=1 与整数解</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择 N</h3>
              <div className="grid grid-cols-3 gap-2">
                {NS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setN(v)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${n === v ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    N={v}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-sm text-gray-700">
                基本解：<b>{base ? `(${base.x}, ${base.y})` : '无'}</b>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">前几组解</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {sols.map((s, i) => (
                  <li key={i}>• 第{i + 1}组：({s.x}, {s.y})</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">知识卡</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 用<b>连分数</b>逼近 √N，渐近分数给出基本解。</li>
                <li>• 由 (x+y√N)<sup>k</sup> <b>递推</b>出无穷多解。</li>
                <li>• 解点全部落在<b>双曲线</b>上，跳过完全平方数 N。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
