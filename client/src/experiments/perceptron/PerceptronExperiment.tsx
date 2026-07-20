import { useState, useEffect, useRef, useMemo } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { perceptronNarration } from '../../narrations/scripts/perceptron'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { generateDataset, trainPerceptron, accuracy, DATASETS } from './perceptron'
import { drawPerceptron } from './draw'

const W = 600
const H = 480

export default function PerceptronExperiment() {
  const [dataIdx, setDataIdx] = useState(1)
  const [step, setStep] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const { points, history } = useMemo(() => {
    const d = DATASETS[dataIdx]
    const pts = generateDataset(d.count, d.seed)
    return { points: pts, history: trainPerceptron(pts) }
  }, [dataIdx])

  const curStep = Math.min(step, history.length - 1)
  const boundary = history[curStep]
  const acc = accuracy(boundary, points)

  useEffect(() => {
    if (narration) narration.loadScript(perceptronNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPerceptron(canvas, points, boundary, curStep > 0)
  }, [points, boundary, curStep])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">感知机</h1>
            <p className="text-gray-600">一条直线分两类</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">第 {curStep} / {history.length - 1} 次更新 · 正确率 {(acc * 100).toFixed(0)}%</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">数据集</h3>
              <div className="space-y-2">
                {DATASETS.map((d, i) => (
                  <button
                    key={d.name}
                    onClick={() => { setDataIdx(i); setStep(0) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${dataIdx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {d.name}（{d.count} 点）
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setStep((s) => Math.max(0, Math.min(s, history.length - 1) - 1))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">上一步</button>
                <button onClick={() => setStep((s) => Math.min(history.length - 1, s + 1))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">单步训练</button>
              </div>
              <button onClick={() => setStep(history.length - 1)} className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200">训练到收敛</button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 感知机是最简单的<b>人工神经元</b>：加权求和 + 符号激活。</li>
                <li>• 每遇到一个分错的点，就把权重朝它的方向<b>推一把</b>。</li>
                <li>• 数据线性可分时，收敛定理保证<b>有限步</b>分开两类。</li>
                <li>• 它是 1958 年 Rosenblatt 提出的，深度学习的<b>起点</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
