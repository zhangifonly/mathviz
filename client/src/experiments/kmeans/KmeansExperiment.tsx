import { useState, useEffect, useRef, useMemo } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { kmeansNarration } from '../../narrations/scripts/kmeans'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { makePoints, runKmeans, K_VALUES } from './kmeans'
import { drawKmeans } from './draw'

const W = 600
const H = 480

export default function KmeansExperiment() {
  const [k, setK] = useState(3)
  const [seed, setSeed] = useState(1)
  const [step, setStep] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(kmeansNarration)
  }, [narration])

  const points = useMemo(() => makePoints(120, W, H, seed), [seed])
  const frames = useMemo(() => runKmeans(points, k, 1), [points, k])
  const shown = Math.min(step, frames.length - 1)
  const converged = shown >= frames.length - 1

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawKmeans(canvas, points, frames[shown])
  }, [points, frames, shown])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">K-means聚类</h1>
            <p className="text-gray-600">迭代分配与更新中心</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">K = {k} · 第 {shown} 步 {converged ? '(已收敛)' : ''}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">簇数量 K</h3>
              <div className="space-y-2">
                {K_VALUES.map((v) => (
                  <button
                    key={v}
                    onClick={() => { setK(v); setStep(0) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${k === v ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    分成 {v} 组
                  </button>
                ))}
              </div>
              <button onClick={() => setStep((s) => s + 1)} disabled={converged} className={`w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium ${converged ? 'bg-gray-100 text-gray-400' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                ▶ 单步迭代
              </button>
              <button onClick={() => { setSeed((s) => s + 1); setStep(0) }} className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🎲 重新生成数据
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与应用</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• <b>分配步</b>：每个点归到离它最近的中心。</li>
                <li>• <b>更新步</b>：中心移到所属点的<b>均值</b>。</li>
                <li>• 两步交替，直到中心不再移动即<b>收敛</b>。</li>
                <li>• 用于图像压缩、客户分群、数据探索。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
