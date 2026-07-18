import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { perfectNumbersNarration } from '../../narrations/scripts/perfect-numbers'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { classify, divisorSum, SAMPLES } from './perfectNumbers'
import { drawPerfectNumbers } from './draw'

const W = 600
const H = 480

const CLASS_TEXT: Record<string, string> = {
  perfect: '完全数',
  abundant: '盈数',
  deficient: '亏数',
}

export default function PerfectNumbersExperiment() {
  const [n, setN] = useState(6)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(perfectNumbersNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPerfectNumbers(canvas, n)
  }, [n])

  const cls = classify(n)
  const sum = divisorSum(n)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">完全数与亲和数</h1>
            <p className="text-gray-600">数字的和谐</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">n = {n} · 真因数和 = {sum}（{CLASS_TEXT[cls]}）</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择数字</h3>
              <div className="space-y-2">
                {SAMPLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setN(s)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${n === s ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    n = {s}（{CLASS_TEXT[classify(s)]}）
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setN((v) => Math.max(2, v - 1))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">− 1</button>
                <button onClick={() => setN((v) => v + 1)} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">+ 1</button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 完全数：真因数之和恰好<b>等于</b>自身，如 6、28、496。</li>
                <li>• 盈数真因数偏<b>多</b>，亏数偏<b>少</b>，完全数居中。</li>
                <li>• 220 与 284 互为真因数和，是最著名的<b>亲和数</b>。</li>
                <li>• 已知完全数都是偶数，是否存在奇完全数仍是<b>未解之谜</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
