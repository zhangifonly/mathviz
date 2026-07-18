import { useState, useEffect, useRef, useMemo } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { towerOfHanoiNarration } from '../../narrations/scripts/tower-of-hanoi'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { solveHanoi, minMoves, DISK_COUNTS } from './towerOfHanoi'
import { drawTowerOfHanoi } from './draw'

const W = 600
const H = 480

export default function TowerOfHanoiExperiment() {
  const [n, setN] = useState(3)
  const [step, setStep] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const steps = useMemo(() => solveHanoi(n, 'A', 'C', 'B'), [n])
  const total = steps.length

  useEffect(() => {
    if (narration) narration.loadScript(towerOfHanoiNarration)
  }, [narration])

  // step 钳制到当前 total 范围内，避免切换盘数后越界（不在 effect 里 setState）
  const safeStep = Math.min(step, total)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawTowerOfHanoi(canvas, n, steps, safeStep)
  }, [n, steps, safeStep])

  const cur = safeStep > 0 ? steps[safeStep - 1] : null

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">汉诺塔</h1>
            <p className="text-gray-600">递归之美与指数增长</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">第 {safeStep} / {total} 步{cur ? ` · 移动 ${cur.disk} 号盘 ${cur.from}→${cur.to}` : ' · 初始状态'}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => setStep(Math.max(0, safeStep - 1))} disabled={safeStep === 0} className="px-3 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-40">◀ 上一步</button>
              <button onClick={() => setStep(Math.min(total, safeStep + 1))} disabled={safeStep === total} className="px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40">下一步 ▶</button>
              <button onClick={() => setStep(0)} className="px-3 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200">重置</button>
              <button onClick={() => setStep(total)} className="px-3 py-2 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200">跳到结束</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">盘子数量</h3>
              <div className="space-y-2">
                {DISK_COUNTS.map((d) => (
                  <button
                    key={d}
                    onClick={() => { setN(d); setStep(0) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${n === d ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {d} 个盘子 · 最少 {minMoves(d)} 步
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">数学趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• n 个盘子最少要 <b>2ⁿ-1</b> 步，一步都省不了。</li>
                <li>• 每多一个盘子，步数<b>翻倍再加一</b>，这就是指数增长。</li>
                <li>• 传说 64 个金盘搬完，需要 2⁶⁴-1 步。</li>
                <li>• 就算每秒一步，也要约 <b>5850 亿年</b>才能搬完。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
