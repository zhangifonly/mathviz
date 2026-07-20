import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { catalanNumbersNarration } from '../../narrations/scripts/catalan-numbers'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { catalan, NS } from './catalanNumbers'
import { drawCatalanNumbers, type CatalanMode } from './draw'

const W = 600
const H = 480

const MODES: { key: CatalanMode; label: string }[] = [
  { key: 'paren', label: '合法括号序列' },
  { key: 'tree', label: '二叉树形态' },
  { key: 'poly', label: '多边形三角剖分' },
]

export default function CatalanNumbersExperiment() {
  const [n, setN] = useState(4)
  const [mode, setMode] = useState<CatalanMode>('poly')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(catalanNumbersNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawCatalanNumbers(canvas, n, mode)
  }, [n, mode])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">卡特兰数</h1>
            <p className="text-gray-600">括号树与三角剖分</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">n = {n} · C({n}) = {catalan(n)}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择 n</h3>
              <div className="space-y-2">
                {NS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setN(v)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${n === v ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    n = {v}（C = {catalan(v)}）
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">组合诠释</h3>
              <div className="space-y-2">
                {MODES.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMode(m.key)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${mode === m.key ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">同一个数列</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 数列开头：1, 1, 2, 5, 14, 42, 132…</li>
                <li>• n 对括号的<b>合法排列</b>共有 C(n) 种。</li>
                <li>• n 个内部节点的<b>二叉树</b>共有 C(n) 种形态。</li>
                <li>• 凸 (n+2) 边形的<b>三角剖分</b>也恰好 C(n) 种。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
