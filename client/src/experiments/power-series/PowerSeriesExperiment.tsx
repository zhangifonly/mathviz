import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { powerSeriesNarration } from '../../narrations/scripts/power-series'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SERIES_OPTIONS } from './powerSeries'
import { drawPowerSeries } from './draw'
import type { DrawData } from './draw'

/** 按级数选择合适的绘图范围 */
function buildData(seriesId: string, terms: number): DrawData | null {
  const series = SERIES_OPTIONS.find((o) => o.id === seriesId)
  if (!series) return null
  if (seriesId === 'exp') return { series, terms, xMin: -3, xMax: 3, yMin: -2, yMax: 12 }
  if (seriesId === 'geometric') return { series, terms, xMin: -1.6, xMax: 1.6, yMin: -3, yMax: 6 }
  return { series, terms, xMin: -1.6, xMax: 1.6, yMin: -2.5, yMax: 2.5 }
}

export default function PowerSeriesExperiment() {
  const [seriesId, setSeriesId] = useState('geometric')
  const [terms, setTerms] = useState(6)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(powerSeriesNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const data = buildData(seriesId, terms)
    if (!data) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawPowerSeries(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seriesId, terms])

  const info = SERIES_OPTIONS.find((o) => o.id === seriesId)!
  const radiusText = Number.isFinite(info.radius) ? `R = ${info.radius}` : 'R = ∞'

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">幂级数收敛 ♾️</h1>
            <p className="text-gray-600">无穷项相加如何逐步逼近一个函数</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.label} · {radiusText} · 前 {terms} 项</h3>
            <canvas ref={canvasRef} width={640} height={520} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择级数</h3>
              <div className="space-y-2">
                {SERIES_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSeriesId(o.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${seriesId === o.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${seriesId === o.id ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">部分和项数：{terms}</h3>
              <input
                type="range"
                min={1}
                max={30}
                value={terms}
                onChange={(e) => setTerms(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-2">项数越多，黄色部分和曲线在收敛域内越贴近蓝色精确函数。</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">收敛趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 幂级数是无穷多个<b>幂函数项</b>之和。</li>
                <li>• 只取前几项的<b>部分和</b>用来近似真实函数。</li>
                <li>• <b>收敛半径</b>划出一条边界，内收敛、外发散。</li>
                <li>• 指数级数处处收敛，收敛半径为<b>无穷大</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
