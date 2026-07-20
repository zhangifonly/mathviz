import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { wilsonTheoremNarration } from '../../narrations/scripts/wilson-theorem'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { factorialMod, wilsonCheck, RANGE } from './wilsonTheorem'
import { drawWilsonTheorem } from './draw'

const W = 600
const H = 480

export default function WilsonTheoremExperiment() {
  const [upTo, setUpTo] = useState(25)
  const [pick, setPick] = useState(7)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(wilsonTheoremNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawWilsonTheorem(canvas, upTo)
  }, [upTo])

  const value = factorialMod(pick - 1, pick)
  const prime = wilsonCheck(pick)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">威尔逊定理</h1>
            <p className="text-gray-600">阶乘的素性判据</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">2 到 {upTo} 的 (n-1)! mod n</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            <p className="text-xs text-gray-500 mt-2">绿色 = 素数（值恰为 n-1，即 ≡ -1）；红色 = 合数（多为 0）</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">展示范围</h3>
              <div className="space-y-2">
                {RANGE.map((n) => (
                  <button
                    key={n}
                    onClick={() => setUpTo(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${upTo === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    2 到 {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">验证某个 n</h3>
              <input type="range" min={2} max={50} value={pick} onChange={(e) => setPick(Number(e.target.value))} className="w-full" />
              <div className="mt-2 text-sm text-gray-700">
                <p>n = <b>{pick}</b></p>
                <p>(n-1)! mod n = <b>{value}</b>，而 n-1 = {pick - 1}</p>
                <p className={`mt-1 font-semibold ${prime ? 'text-green-600' : 'text-red-500'}`}>
                  {prime ? `等式成立 → ${pick} 是素数` : `不成立 → ${pick} 是合数`}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• (n-1)! ≡ -1 (mod n) 当且仅当 n 为素数。</li>
                <li>• 边乘边取模，永不溢出。</li>
                <li>• 是充要条件，但阶乘增长太快，不适合做快速判素。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
