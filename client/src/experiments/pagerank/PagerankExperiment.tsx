import { useState, useEffect, useRef, useMemo } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { pagerankNarration } from '../../narrations/scripts/pagerank'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { pagerank, WEB_GRAPH, DAMPING_OPTIONS } from './pagerank'
import { drawPagerank } from './draw'

const W = 600
const H = 480
const ITERS = 20

export default function PagerankExperiment() {
  const [damping, setDamping] = useState(0.85)
  const [step, setStep] = useState(ITERS)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const result = useMemo(() => pagerank(WEB_GRAPH, damping, ITERS), [damping])
  const frame = Math.min(step, result.history.length - 1)
  const rank = result.history[frame]

  useEffect(() => {
    if (narration) narration.loadScript(pagerankNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPagerank(canvas, WEB_GRAPH, rank)
  }, [rank])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">PageRank</h1>
            <p className="text-gray-600">网页链接的稳态分布</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">第 {frame} 次迭代 · 节点大小 = PageRank 值</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">阻尼因子 d</h3>
              <div className="space-y-2">
                {DAMPING_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => { setDamping(d); setStep(ITERS) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${damping === d ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    d = {d}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">迭代次数：{frame}</h3>
              <input
                type="range"
                min={0}
                max={ITERS}
                value={frame}
                onChange={(e) => setStep(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">应用与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• PageRank 是谷歌早期排名网页的<b>核心算法</b>。</li>
                <li>• 它模拟一个<b>随机浏览者</b>无限点击链接后的停留概率。</li>
                <li>• 阻尼因子 d 表示继续点链接的概率，其余则<b>随机跳转</b>。</li>
                <li>• 幂迭代让 rank 向量收敛到转移矩阵的<b>稳态分布</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
