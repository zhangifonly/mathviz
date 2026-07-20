import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { bfsDfsNarration } from '../../narrations/scripts/bfs-dfs'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { MAZE, MODES, START, GOAL, search, type Mode } from './bfsDfs'
import { drawBfsDfs } from './draw'

const W = 600
const H = 480
const LABELS: Record<Mode, string> = { bfs: '广度优先 BFS', dfs: '深度优先 DFS' }

export default function BfsDfsExperiment() {
  const [mode, setMode] = useState<Mode>('bfs')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(bfsDfsNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawBfsDfs(canvas, MAZE, mode, -1, true)
  }, [mode])

  const res = search(mode, MAZE, START, GOAL)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">广度与深度优先搜索</h1>
            <p className="text-gray-600">层层扩散 vs 一路到底</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{LABELS[mode]} · 访问 {res.order.length} 格 · 路径 {res.path.length} 步</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">搜索策略</h3>
              <div className="space-y-2">
                {MODES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${mode === m ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {LABELS[m]}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">冷色=先访问，暖色=后访问；黄线为最终路径。</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点对比</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• BFS 用<b>队列</b>，逐层向外扩散，无权图上必得<b>最短路</b>。</li>
                <li>• DFS 用<b>栈</b>，沿一条路走到底，撞墙再回溯。</li>
                <li>• 两者都访问全部可达格，但顺序与路径大不相同。</li>
                <li>• 迷宫求解、连通分量、拓扑排序都建立在它们之上。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
