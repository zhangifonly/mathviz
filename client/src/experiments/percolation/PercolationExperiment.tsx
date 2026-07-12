import { useState, useEffect, useRef, useMemo } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { percolationNarration } from '../../narrations/scripts/percolation'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { createRng, generateLattice, analyze, P_OPTIONS, P_C_SITE_SQUARE } from './percolation'
import { drawPercolation } from './draw'

const SIZE = 100

export default function PercolationExperiment() {
  const [p, setP] = useState(0.55)
  const [seed, setSeed] = useState(7)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(percolationNarration)
  }, [narration])

  const grid = useMemo(() => generateLattice(SIZE, p, createRng(seed)), [p, seed])
  const stats = useMemo(() => analyze(grid, p), [grid, p])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawPercolation(canvas, { grid, p }, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [grid, p])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">渗流模型</h1>
            <p className="text-gray-600">随机点阵上的连通相变与临界现象</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{SIZE} × {SIZE} 点阵 · p = {p.toFixed(2)}</h3>
            <canvas ref={canvasRef} width={600} height={600} className="w-full rounded-lg" />
            <p className="text-xs text-gray-500 mt-2">金色为贯穿顶底的渗流簇，其余颜色为独立连通簇，深色为关闭格点。</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">开放概率 p</h3>
              <input
                type="range"
                min={0.3}
                max={0.85}
                step={0.01}
                value={p}
                onChange={(e) => setP(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="mt-3 grid grid-cols-1 gap-2">
                {P_OPTIONS.map((o) => (
                  <button
                    key={o.p}
                    onClick={() => setP(o.p)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${Math.abs(p - o.p) < 0.005 ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${Math.abs(p - o.p) < 0.005 ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSeed((s) => s + 1)}
                className="mt-3 w-full px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                重新随机取样
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">实时统计</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>开放格点比例：<b>{(stats.openFraction * 100).toFixed(1)}%</b></li>
                <li>连通簇数量：<b>{stats.clusterCount}</b></li>
                <li>最大簇占比（序参量）：<b>{(stats.largestFraction * 100).toFixed(1)}%</b></li>
                <li>是否渗流：<b className={stats.percolates ? 'text-emerald-600' : 'text-rose-600'}>{stats.percolates ? '已贯穿' : '未贯穿'}</b></li>
                <li className="text-xs text-gray-400 pt-1">二维方格站点渗流临界概率 p_c ≈ {P_C_SITE_SQUARE}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
