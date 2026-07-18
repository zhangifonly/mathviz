import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { naiveBayesNarration } from '../../narrations/scripts/naive-bayes'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { makeDataset, classify, DATASETS } from './naiveBayes'
import { drawNaiveBayes, drawQuery } from './draw'

const W = 600
const H = 480
const LABELS = ['靛蓝类', '品红类']

export default function NaiveBayesExperiment() {
  const [count, setCount] = useState(40)
  const [seed, setSeed] = useState(1)
  const [query, setQuery] = useState({ x: 3, y: 3 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(naiveBayesNarration)
  }, [narration])

  const train = makeDataset(count, seed)
  const predicted = classify(train, query.x, query.y)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawNaiveBayes(canvas, train, 8, true)
    drawQuery(canvas, train, query.x, query.y)
  }, [train, query])

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const py = ((e.clientY - rect.top) / rect.height) * H
    setQuery({ x: (px / W) * 6, y: (1 - py / H) * 6 })
  }

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">朴素贝叶斯</h1>
            <p className="text-gray-600">特征独立假设分类</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">每类 {count} 点 · 点击画布放置查询点</h3>
            <canvas ref={canvasRef} width={W} height={H} onClick={onCanvasClick} className="w-full rounded-lg bg-slate-50 cursor-crosshair" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">每类样本数</h3>
              <div className="space-y-2">
                {DATASETS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${count === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    每类 {n} 个样本
                  </button>
                ))}
              </div>
              <button onClick={() => setSeed((s) => s + 1)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🎲 重新采样数据
              </button>
              <div className="mt-3 p-3 rounded-lg bg-slate-50 text-sm">
                <div>查询点 ({query.x.toFixed(2)}, {query.y.toFixed(2)})</div>
                <div className="font-semibold mt-1" style={{ color: predicted === 0 ? '#6366f1' : '#ec4899' }}>
                  预测：{LABELS[predicted]}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 后验 ∝ <b>先验 × 似然</b>，取后验最大的类别。</li>
                <li>• 朴素假设各特征<b>相互独立</b>，似然直接相乘。</li>
                <li>• 连续特征用<b>高斯分布</b>估计均值与方差。</li>
                <li>• 假设很朴素，但在垃圾邮件、文本分类中<b>出奇好用</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
