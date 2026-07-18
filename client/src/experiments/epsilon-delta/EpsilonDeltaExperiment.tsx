import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { epsilonDeltaNarration } from '../../narrations/scripts/epsilon-delta'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FUNCTIONS, EPSILONS, findDelta } from './epsilonDelta'
import { drawEpsilonDelta } from './draw'

const W = 600
const H = 480

export default function EpsilonDeltaExperiment() {
  const [funcId, setFuncId] = useState(FUNCTIONS[0].id)
  const [eps, setEps] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const func = FUNCTIONS.find((f) => f.id === funcId) ?? FUNCTIONS[0]
  const delta = findDelta(func.fn, func.a, func.L, eps)

  useEffect(() => {
    if (narration) narration.loadScript(epsilonDeltaNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawEpsilonDelta(canvas, func, eps)
  }, [func, eps])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">ε-δ极限定义</h1>
            <p className="text-gray-600">极限的严格刻画</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{func.label} · ε={eps} → δ≈{delta.toFixed(3)}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择函数</h3>
              <div className="space-y-2">
                {FUNCTIONS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFuncId(f.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${funcId === f.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">挑战 ε（越小越严）</h3>
              <div className="grid grid-cols-2 gap-2">
                {EPSILONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEps(e)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${eps === e ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
                  >
                    ε = {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 蓝色横带是 L±ε，粉色竖带是 a±δ。</li>
                <li>• δ 内的曲线段恰好落在 ε 带里。</li>
                <li>• ε 越小，可行的 δ 也随之收缩。</li>
                <li>• 任意 ε 都能找到 δ，极限才成立。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
