import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { euclideanAlgorithmNarration } from '../../narrations/scripts/euclidean-algorithm'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { gcdSteps, extendedGcd, SAMPLES } from './euclideanAlgorithm'
import { drawEuclideanAlgorithm } from './draw'

const W = 600
const H = 480

export default function EuclideanAlgorithmExperiment() {
  const [pair, setPair] = useState<number[]>(SAMPLES[0])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(euclideanAlgorithmNarration)
  }, [narration])

  const [a, b] = pair
  const steps = gcdSteps(a, b)
  const g = steps.length ? steps[steps.length - 1].b : a
  const ext = extendedGcd(a, b)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawEuclideanAlgorithm(canvas, a, b, -1)
  }, [a, b])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">欧几里得算法</h1>
            <p className="text-gray-600">辗转相除求最大公约数</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">gcd({a}, {b}) = {g} · 切正方形</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择两数</h3>
              <div className="space-y-2">
                {SAMPLES.map(([x, y]) => (
                  <button
                    key={`${x}-${y}`}
                    onClick={() => setPair([x, y])}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${a === x && b === y ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    a = {x}, b = {y}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">辗转相除</h3>
              <ul className="text-xs text-gray-600 space-y-1 font-mono">
                {steps.map((s, i) => (
                  <li key={i}>{s.a} = {s.q} × {s.b} + {s.r}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-gray-700">裴蜀等式：{a}×{ext.x} + {b}×{ext.y} = {ext.g}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
