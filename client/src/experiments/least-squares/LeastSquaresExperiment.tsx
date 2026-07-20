import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { leastSquaresNarration } from '../../narrations/scripts/least-squares'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { makePoints, fitLine, rss, rSquared, NOISE_LEVELS } from './leastSquares'
import { drawLeastSquares } from './draw'

const W = 600
const H = 480

export default function LeastSquaresExperiment() {
  const [noise, setNoise] = useState(NOISE_LEVELS[1])
  const [count, setCount] = useState(24)
  const [seed, setSeed] = useState(1)
  const [showResiduals, setShowResiduals] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(leastSquaresNarration)
  }, [narration])

  const points = makePoints(count, noise, seed)
  const line = fitLine(points)
  const r2 = rSquared(points, line)
  const err = rss(points, line)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawLeastSquares(canvas, makePoints(count, noise, seed), showResiduals, true)
  }, [count, noise, seed, showResiduals])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">最小二乘法</h1>
            <p className="text-gray-600">最优直线拟合</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{count} 个散点 · 最优拟合直线</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">噪声大小</h3>
              <div className="space-y-2">
                {NOISE_LEVELS.map((nz, i) => (
                  <button
                    key={nz}
                    onClick={() => setNoise(nz)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${noise === nz ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {['小', '中', '大'][i]}噪声
                  </button>
                ))}
              </div>
              <button onClick={() => setCount((c) => (c >= 48 ? 12 : c + 12))} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-sky-100 text-sky-700 hover:bg-sky-200">
                点数：{count}（点击切换）
              </button>
              <button onClick={() => setSeed((s) => s + 1)} className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🎲 重新随机散点
              </button>
              <button onClick={() => setShowResiduals((v) => !v)} className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium bg-rose-100 text-rose-700 hover:bg-rose-200">
                {showResiduals ? '隐藏' : '显示'}残差线段
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">拟合结果</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 直线：<b>y = {line.slope.toFixed(2)}x + {line.intercept.toFixed(1)}</b></li>
                <li>• 残差平方和 RSS = <b>{err.toFixed(1)}</b></li>
                <li>• 决定系数 R² = <b>{r2.toFixed(3)}</b>（越接近 1 越好）</li>
                <li>• 闭式解：k = cov(x,y)/var(x)，b = ȳ − k·x̄。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
