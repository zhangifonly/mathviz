import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { inclusionExclusionNarration } from '../../narrations/scripts/inclusion-exclusion'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLES, divisibleSets, unionSizeIE } from './inclusionExclusion'
import { drawInclusionExclusion } from './draw'

const W = 600
const H = 480

export default function InclusionExclusionExperiment() {
  const [idx, setIdx] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(inclusionExclusionNarration)
  }, [narration])

  const sample = SAMPLES[idx]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawInclusionExclusion(canvas, sample)
  }, [sample])

  const sets = divisibleSets(sample.n, sample.divisors)
  const singles = sets.map((s) => s.length)
  const [d0, d1, d2] = sample.divisors
  const pairInter = [d0 * d1, d0 * d2, d1 * d2].map(
    (lcm) => Math.floor(sample.n / lcm),
  )
  const triple = Math.floor(sample.n / (d0 * d1 * d2))
  const total = unionSizeIE(sets)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">容斥原理</h1>
            <p className="text-gray-600">交替加减算并集</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">1 到 {sample.n} 中能被 2/3/5 整除的数</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择范围 N</h3>
              <div className="space-y-2">
                {SAMPLES.map((s, i) => (
                  <button
                    key={s.n}
                    onClick={() => setIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    1 到 {s.n}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">容斥逐项</h3>
              <div className="text-sm text-gray-700 space-y-1 font-mono">
                <div className="text-emerald-600">+ 单集合: {singles.join(' + ')} = {singles.reduce((a, b) => a + b, 0)}</div>
                <div className="text-rose-600">- 两两交: {pairInter.join(' + ')} = {pairInter.reduce((a, b) => a + b, 0)}</div>
                <div className="text-emerald-600">+ 三三交: {triple}</div>
                <div className="mt-2 pt-2 border-t font-bold text-indigo-700">并集 = {total}</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 直接相加会把重叠<b>重复计数</b>。</li>
                <li>• 容斥用<b>加减交替</b>精确修正。</li>
                <li>• 符号规律：奇数个集合取正，偶数取负。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
