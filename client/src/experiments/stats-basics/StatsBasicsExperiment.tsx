import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { statsBasicsNarration } from '../../narrations/scripts/stats-basics'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { DATASET_OPTIONS, summarize } from './statsBasics'
import { drawStatsBasics } from './draw'

export default function StatsBasicsExperiment() {
  const [key, setKey] = useState(DATASET_OPTIONS[0].key)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(statsBasicsNarration)
  }, [narration])

  const option = DATASET_OPTIONS.find((o) => o.key === key)!
  const stats = summarize(option.data)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const data = option.data
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawStatsBasics(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [option])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">统计初步</h1>
            <p className="text-gray-600">用几个数字读懂一组数据</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{option.label} · 柱状图与参考线</h3>
            <canvas ref={canvasRef} width={600} height={420} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择数据集</h3>
              <div className="space-y-2">
                {DATASET_OPTIONS.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => setKey(o.key)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${key === o.key ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${key === o.key ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">统计量</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 平均数：<b>{stats.mean.toFixed(2)}</b></li>
                <li>• 中位数：<b>{stats.median.toFixed(2)}</b></li>
                <li>• 众数：<b>{stats.mode.join('、')}</b></li>
                <li>• 极差：<b>{stats.range}</b></li>
                <li>• 方差：<b>{stats.variance.toFixed(2)}</b></li>
                <li>• 标准差：<b>{stats.stdDev.toFixed(2)}</b></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
