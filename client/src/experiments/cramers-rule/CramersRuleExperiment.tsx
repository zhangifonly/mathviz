import { useState, useEffect, useRef, useMemo } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { cramersRuleNarration } from '../../narrations/scripts/cramers-rule'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLE_SYSTEMS, cramerSolve, det } from './cramersRule'
import { drawCramersRule } from './draw'

const W = 600
const H = 480

export default function CramersRuleExperiment() {
  const [idx, setIdx] = useState(0)
  const [a00, setA00] = useState(SAMPLE_SYSTEMS[0].A[0][0])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(cramersRuleNarration)
  }, [narration])

  const base = SAMPLE_SYSTEMS[idx]
  const A = useMemo(() => [[a00, base.A[0][1]], base.A[1]], [a00, base])
  const b = base.b
  const D = det(A)
  const sol = cramerSolve(A, b)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawCramersRule(canvas, A, b, 34)
  }, [A, b])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">克拉默法则</h1>
            <p className="text-gray-600">行列式之比解方程</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">两直线交点 = 方程组的解</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择方程组</h3>
              <div className="space-y-2">
                {SAMPLE_SYSTEMS.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => { setIdx(i); setA00(s.A[0][0]) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <label className="block mt-3 text-sm text-gray-600">首个系数 a = {a00}</label>
              <input type="range" min={-4} max={4} step={0.5} value={a00}
                onChange={(e) => setA00(Number(e.target.value))} className="w-full" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">克拉默法则</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• x<sub>i</sub> = det(A<sub>i</sub>) / det(A)</li>
                <li>• A<sub>i</sub> = 把 A 的第 i 列换成常数向量 b。</li>
                <li>• 系数行列式 det(A) = <b>{D.toFixed(2)}</b>。</li>
                <li>• {sol ? `当前解 x=${sol[0].toFixed(2)}, y=${sol[1].toFixed(2)}` : 'det(A)=0，两线平行，无唯一解。'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
