import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { gaussianMixtureNarration } from '../../narrations/scripts/gaussian-mixture'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { makeData, fitEM, SEEDS } from './gaussianMixture'
import { drawGaussianMixture } from './draw'

const W = 600
const H = 480

export default function GaussianMixtureExperiment() {
  const [seed, setSeed] = useState(42)
  const [step, setStep] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const data = useMemo(() => makeData(600, seed), [seed])
  const history = useMemo(() => fitEM(data, 3), [data])
  const total = history.length - 1
  const shown = Math.min(step, total)

  useEffect(() => {
    if (narration) narration.loadScript(gaussianMixtureNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawGaussianMixture(canvas, data, history[shown])
  }, [data, history, shown])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">高斯混合模型</h1>
            <p className="text-gray-600">EM算法分离簇</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">EM 迭代 {shown} / {total} 步</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">单步 EM</h3>
              <div className="flex gap-2">
                <button onClick={() => setStep((s) => Math.min(s + 1, total))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600">
                  下一步 ▶
                </button>
                <button onClick={() => setStep(0)} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">
                  重置
                </button>
              </div>
              <button onClick={() => setStep(total)} className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                直接收敛
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">数据种子</h3>
              <div className="grid grid-cols-2 gap-2">
                {SEEDS.map((s) => (
                  <button key={s} onClick={() => { setSeed(s); setStep(0) }} className={`px-3 py-2 rounded-lg text-sm font-medium ${seed === s ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    种子 {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 灰色柱是数据直方图，藏着几个群。</li>
                <li>• 彩色曲线是各高斯分量，黑线是混合总曲线。</li>
                <li>• E 步算责任度，M 步更新均值方差权重。</li>
                <li>• 单步推进，看分量如何滑向各自的簇。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
