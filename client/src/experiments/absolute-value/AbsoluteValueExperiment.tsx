import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { absoluteValueNarration } from '../../narrations/scripts/absolute-value'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { ABSOLUTE_VALUE_OPTIONS, roots } from './absoluteValue'
import { drawAbsoluteValue } from './draw'

const RANGE = 6

export default function AbsoluteValueExperiment() {
  const [idx, setIdx] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(absoluteValueNarration)
  }, [narration])

  const opt = ABSOLUTE_VALUE_OPTIONS[idx]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawAbsoluteValue(canvas, { a: opt.a, h: opt.h, k: opt.k, range: RANGE }, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [opt])

  const rts = roots(opt.a, opt.h, opt.k)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">绝对值函数</h1>
            <p className="text-gray-600">从距离到 V 形折线，看懂平移与缩放</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{opt.label}</h3>
            <canvas ref={canvasRef} width={600} height={600} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择函数</h3>
              <div className="space-y-2">
                {ABSOLUTE_VALUE_OPTIONS.map((o, i) => (
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
              <h3 className="text-lg font-semibold mb-3">当前函数</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 顶点：<b>({opt.h}, {opt.k})</b></li>
                <li>• 开口方向：<b>{opt.a > 0 ? '向上' : '向下'}</b>，陡缓系数 <b>{Math.abs(opt.a)}</b></li>
                <li>• 与横轴交点：<b>{rts.length ? rts.map((r) => r.toFixed(0)).join(' , ') : '无'}</b></li>
                <li>• 绝对值表示到零的<b>距离</b>，永远非负，所以图像是 V 形。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
