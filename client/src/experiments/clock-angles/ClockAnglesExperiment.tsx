import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { clockAnglesNarration } from '../../narrations/scripts/clock-angles'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { angleBetween, TIME_OPTIONS } from './clockAngles'
import { drawClockAngles } from './draw'

export default function ClockAnglesExperiment() {
  const [idx, setIdx] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const time = TIME_OPTIONS[idx]

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(clockAnglesNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawClockAngles(canvas, { hour: time.hour, minute: time.minute }, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [time])

  const angle = Number(angleBetween(time.hour, time.minute).toFixed(1))

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">时钟与角度</h1>
            <p className="text-gray-600">钟面就是一个圆，指针转动就是在画角</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{time.label} · 夹角 {angle} 度</h3>
            <canvas ref={canvasRef} width={560} height={560} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择时刻</h3>
              <div className="space-y-2">
                {TIME_OPTIONS.map((o, i) => (
                  <button
                    key={o.label}
                    onClick={() => setIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${idx === i ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">角度小知识</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 整个钟面是一个 <b>360 度</b> 的圆。</li>
                <li>• 分针每分钟走 <b>6 度</b>（360 除以 60）。</li>
                <li>• 时针每小时走 <b>30 度</b>，每分钟再多走 <b>0.5 度</b>。</li>
                <li>• 两针夹角 = 两个角度相减，取较小的那个。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
