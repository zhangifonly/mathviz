import { useState, useEffect, useRef, useMemo } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { dynamicProgrammingNarration } from '../../narrations/scripts/dynamic-programming'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { lcs, knapsack01, LCS_SAMPLE, KNAPSACK_SAMPLE } from './dynamicProgramming'
import { drawDynamicProgramming, type DpView } from './draw'

const W = 600
const H = 480

function buildView(mode: 'lcs' | 'knap'): DpView {
  if (mode === 'lcs') {
    const r = lcs(LCS_SAMPLE.s1, LCS_SAMPLE.s2)
    return {
      table: r.table,
      rowLabels: ['∅', ...r.s1.split('')],
      colLabels: ['∅', ...r.s2.split('')],
      path: r.path,
    }
  }
  const r = knapsack01(KNAPSACK_SAMPLE.items, KNAPSACK_SAMPLE.cap)
  return {
    table: r.table,
    rowLabels: ['∅', ...r.items.map((it) => it.name)],
    colLabels: Array.from({ length: r.cap + 1 }, (_, i) => String(i)),
    path: r.path,
  }
}

export default function DynamicProgrammingExperiment() {
  const [mode, setMode] = useState<'lcs' | 'knap'>('lcs')
  const [step, setStep] = useState(999)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const view = useMemo(() => buildView(mode), [mode])
  const totalCells = view.table.length * view.table[0].length
  const filled = Math.min(step, totalCells)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(dynamicProgrammingNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) drawDynamicProgramming(canvas, view, filled)
  }, [view, filled])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">动态规划</h1>
            <p className="text-gray-600">重叠子问题与记忆化</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              {mode === 'lcs' ? '最长公共子序列 DP 表' : '0-1 背包 DP 表'}
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择问题</h3>
              <div className="space-y-2">
                <button onClick={() => { setMode('lcs'); setStep(999) }} className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${mode === 'lcs' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>最长公共子序列</button>
                <button onClick={() => { setMode('knap'); setStep(999) }} className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${mode === 'knap' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>0-1 背包问题</button>
              </div>
              <label className="block text-sm text-gray-600 mt-4 mb-1">填表进度：{filled} / {totalCells} 格</label>
              <input type="range" min={0} max={totalCells} value={filled} onChange={(e) => setStep(Number(e.target.value))} className="w-full accent-indigo-500" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">核心思想</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 大问题拆成<b>重叠子问题</b>，结果存表避免重算。</li>
                <li>• 每格只依赖已算出的邻格，一次填满。</li>
                <li>• 橙框是<b>最优路径</b>的回溯轨迹。</li>
                <li>• 递归指数级，填表只需 O(mn)。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
