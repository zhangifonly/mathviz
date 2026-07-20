import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { windowingNarration } from '../../narrations/scripts/windowing'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { WINDOWS, WINDOW_LABELS, type WindowKind } from './windowing'
import { drawWindowing } from './draw'

const W = 600
const H = 480

export default function WindowingExperiment() {
  const [kind, setKind] = useState<WindowKind>('rect')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(windowingNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawWindowing(canvas, kind, 128, 8.5)
  }, [kind])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">加窗函数</h1>
            <p className="text-gray-600">减少频谱泄漏</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{WINDOW_LABELS[kind]} · 窗形状与加窗后频谱</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择窗函数</h3>
              <div className="space-y-2">
                {WINDOWS.map((k) => (
                  <button
                    key={k}
                    onClick={() => setKind(k)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${kind === k ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {WINDOW_LABELS[k]}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与权衡</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 信号频率取 <b>8.5</b> 个周期，非整数，故意制造泄漏。</li>
                <li>• 矩形窗<b>主瓣最窄</b>但旁瓣高，泄漏严重。</li>
                <li>• 汉宁/布莱克曼窗<b>旁瓣低</b>，泄漏小，但主瓣变宽。</li>
                <li>• 分辨率与泄漏是一对<b>此消彼长</b>的权衡。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
