import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { maxLikelihoodNarration } from '../../narrations/scripts/max-likelihood'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { DATASETS, mleMu } from './maxLikelihood'
import { drawMaxLikelihood } from './draw'

const W = 600
const H = 480

export default function MaxLikelihoodExperiment() {
  const [dsIndex, setDsIndex] = useState(0)
  const [muOffset, setMuOffset] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const dataset = DATASETS[dsIndex]
  const sigma = 1
  const mle = mleMu(dataset.values)
  const currentMu = mle + muOffset

  useEffect(() => {
    if (narration) narration.loadScript(maxLikelihoodNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawMaxLikelihood(canvas, dataset, sigma, currentMu)
  }, [dataset, currentMu])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">最大似然估计</h1>
            <p className="text-gray-600">最可能的参数</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{dataset.name} · 对数似然与直方图</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择数据集</h3>
              <div className="space-y-2">
                {DATASETS.map((ds, i) => (
                  <button
                    key={ds.name}
                    onClick={() => { setDsIndex(i); setMuOffset(0) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${dsIndex === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {ds.name}（{ds.values.length} 个观测）
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="text-sm text-gray-600">试探参数 mu = {currentMu.toFixed(2)}</label>
                <input
                  type="range" min={-3} max={3} step={0.05} value={muOffset}
                  onChange={(e) => setMuOffset(Number(e.target.value))}
                  className="w-full mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">拖动橙色竖线偏离，看似然如何下降。MLE = {mle.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 似然=在给定参数下，观测到这批数据的<b>可能性</b>。</li>
                <li>• 取对数把连乘变连加，峰值位置不变。</li>
                <li>• 正态 mu 的 MLE 恰是<b>样本均值</b>，有闭式解。</li>
                <li>• 峰顶越尖，说明数据对参数的约束越强。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
