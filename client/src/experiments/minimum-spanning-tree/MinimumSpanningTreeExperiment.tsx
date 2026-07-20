import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { minimumSpanningTreeNarration } from '../../narrations/scripts/minimum-spanning-tree'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLE_GRAPH, ALGORITHMS, runMST, type Algorithm } from './minimumSpanningTree'
import { drawMinimumSpanningTree } from './draw'

const W = 600
const H = 480
const LABELS: Record<Algorithm, string> = { kruskal: 'Kruskal（排序+并查集）', prim: 'Prim（逐步扩展）' }

export default function MinimumSpanningTreeExperiment() {
  const [algo, setAlgo] = useState<Algorithm>('kruskal')
  const [step, setStep] = useState(SAMPLE_GRAPH.nodes.length - 1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const result = runMST(SAMPLE_GRAPH, algo)
  const maxStep = result.mstEdges.length
  const shownStep = Math.min(step, maxStep)

  useEffect(() => {
    if (narration) narration.loadScript(minimumSpanningTreeNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawMinimumSpanningTree(canvas, SAMPLE_GRAPH, result.mstEdges, shownStep)
  }, [result, shownStep])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">最小生成树</h1>
            <p className="text-gray-600">Kruskal与Prim</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{LABELS[algo]} · 已加 {shownStep}/{maxStep} 条边 · 总权重 {result.mstEdges.slice(0, shownStep).reduce((s, e) => s + e.w, 0)}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择算法</h3>
              <div className="space-y-2">
                {ALGORITHMS.map((a) => (
                  <button
                    key={a}
                    onClick={() => { setAlgo(a); setStep(SAMPLE_GRAPH.nodes.length - 1) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${algo === a ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {LABELS[a]}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setStep((s) => Math.max(0, Math.min(s, maxStep) - 1))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">◀ 上一步</button>
                <button onClick={() => setStep((s) => Math.min(maxStep, s + 1))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">下一步 ▶</button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 生成树连通所有点且<b>无环</b>，恰 n-1 条边。</li>
                <li>• Kruskal 按边权<b>排序</b>，用<b>并查集</b>防成环。</li>
                <li>• Prim 从一点出发，反复并入最小<b>跨界边</b>。</li>
                <li>• 两种贪心得到的<b>总权重相同</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
