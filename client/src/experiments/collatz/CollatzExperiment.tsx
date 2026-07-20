import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { collatzNarration } from '../../narrations/scripts/collatz'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { stoppingTime, maxValue, START_VALUES } from './collatz'
import { drawCollatz } from './draw'

const W = 600
const H = 480

export default function CollatzExperiment() {
  const [start, setStart] = useState(27)
  const [overlay, setOverlay] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(collatzNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const starts = overlay ? START_VALUES : [start]
    drawCollatz(canvas, starts)
  }, [start, overlay])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">考拉兹猜想</h1>
            <p className="text-gray-600">3n+1 的未解之谜</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{overlay ? '多起点“意大利面”图' : `起点 ${start} 的冰雹轨迹`}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择起点</h3>
              <input
                type="number"
                min={1}
                value={start}
                onChange={(e) => { setStart(Math.max(1, Math.floor(Number(e.target.value) || 1))); setOverlay(false) }}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm mb-3"
              />
              <div className="space-y-2">
                {START_VALUES.map((n) => (
                  <button
                    key={n}
                    onClick={() => { setStart(n); setOverlay(false) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${!overlay && start === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    从 {n} 出发
                  </button>
                ))}
              </div>
              <button onClick={() => setOverlay((v) => !v)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🍝 {overlay ? '只看单条轨迹' : '叠加多条轨迹'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">当前数据</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 起点：<b>{start}</b></li>
                <li>• 停止时间（步数）：<b>{stoppingTime(start)}</b></li>
                <li>• 轨迹峰值：<b>{maxValue(start)}</b></li>
                <li>• 规则：偶数减半，奇数<b>乘 3 加 1</b>。</li>
                <li>• 是否人人归 1，<b>至今无人能证明</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
