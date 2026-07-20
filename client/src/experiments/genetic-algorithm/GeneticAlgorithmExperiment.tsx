import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { geneticAlgorithmNarration } from '../../narrations/scripts/genetic-algorithm'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { runGA, POP_SIZE, MUTATION_RATE } from './geneticAlgorithm'
import { drawGeneticAlgorithm } from './draw'

const W = 600
const H = 480
const MAX_GEN = 30

export default function GeneticAlgorithmExperiment() {
  const [seed, setSeed] = useState(1)
  const [gen, setGen] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(geneticAlgorithmNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const history = runGA(POP_SIZE, MAX_GEN, seed)
    drawGeneticAlgorithm(canvas, history, Math.min(gen, MAX_GEN))
  }, [seed, gen])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">遗传算法</h1>
            <p className="text-gray-600">选择交叉变异进化</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">第 {Math.min(gen, MAX_GEN)} / {MAX_GEN} 代 · 种群向最优峰聚集</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">进化控制</h3>
              <div className="flex gap-2">
                <button onClick={() => setGen((g) => Math.min(g + 1, MAX_GEN))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600">
                  进化一代 ▶
                </button>
                <button onClick={() => setGen(0)} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                  重置
                </button>
              </div>
              <button onClick={() => { setSeed((s) => s + 1); setGen(0) }} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🎲 换一批初始种群
              </button>
              <p className="text-xs text-gray-500 mt-3">种群规模 {POP_SIZE} · 变异率 {MUTATION_RATE}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与应用</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 个体是<b>候选解</b>，适应度就是目标函数值。</li>
                <li>• <b>选择</b>让优者多留后代，<b>交叉</b>组合基因，<b>变异</b>保持多样性。</li>
                <li>• 种群一代代向<b>全局最优峰</b>聚集。</li>
                <li>• 常用于调参、排程、路径规划等难优化问题。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
