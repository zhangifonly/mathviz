import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { decisionTreeNarration } from '../../narrations/scripts/decision-tree'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { DATASET, MAX_DEPTH } from './decisionTree'
import { drawDecisionTree } from './draw'

const W = 600
const H = 480

export default function DecisionTreeExperiment() {
  const [depth, setDepth] = useState(2)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(decisionTreeNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawDecisionTree(canvas, DATASET, depth, 6)
  }, [depth])

  const depths = Array.from({ length: MAX_DEPTH + 1 }, (_, i) => i)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">决策树</h1>
            <p className="text-gray-600">按信息增益分裂</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">树深 {depth} · 轴对齐分类区域</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">最大树深</h3>
              <div className="grid grid-cols-3 gap-2">
                {depths.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDepth(d)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${depth === d ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">深度越大，区域切得越细，越贴合训练点，也越可能过拟合。</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与应用</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 用<b>信息熵</b>衡量一堆标签的混乱程度。</li>
                <li>• 每次挑<b>信息增益</b>最大的轴对齐分裂，把数据切得更纯。</li>
                <li>• 每个叶子对应一块<b>矩形区域</b>，落进去就按多数类预测。</li>
                <li>• 信贷审批、医疗诊断、推荐系统都用它做可解释的分类。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
