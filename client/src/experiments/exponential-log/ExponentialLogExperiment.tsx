import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { exponentialLogNarration } from '../../narrations/scripts/exponential-log'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { BASE_OPTIONS } from './exponentialLog'
import { drawExponentialLog, type DrawData } from './draw'

export default function ExponentialLogExperiment() {
  const [base, setBase] = useState(2)
  const [showExp, setShowExp] = useState(true)
  const [showLog, setShowLog] = useState(true)
  const [showMirror, setShowMirror] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(exponentialLogNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const data: DrawData = { base, showExp, showLog, showMirror }
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawExponentialLog(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [base, showExp, showLog, showMirror])

  const info = BASE_OPTIONS.find((o) => o.base === base)!

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">指数与对数</h1>
            <p className="text-gray-600">互为反函数的一对孪生曲线，关于 y = x 对称</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.label} · 指数与对数曲线</h3>
            <canvas ref={canvasRef} width={600} height={600} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择底数</h3>
              <div className="space-y-2">
                {BASE_OPTIONS.map((o) => (
                  <button
                    key={o.label}
                    onClick={() => setBase(o.base)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${base === o.base ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${base === o.base ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">显示选项</h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showExp} onChange={(e) => setShowExp(e.target.checked)} />
                  <span className="text-indigo-600 font-medium">指数曲线 y = a 的 x 次方</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showLog} onChange={(e) => setShowLog(e.target.checked)} />
                  <span className="text-pink-600 font-medium">对数曲线 y = 以 a 为底 x 的对数</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showMirror} onChange={(e) => setShowMirror(e.target.checked)} />
                  <span className="text-gray-500 font-medium">对称轴 y = x</span>
                </label>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">数学趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 指数函数<b>成倍增长</b>，一张纸对折 42 次就能到月球。</li>
                <li>• 对数是指数的<b>反函数</b>，两曲线关于 y = x <b>对称</b>。</li>
                <li>• <b>换底公式</b>让任意底数的对数都能用自然对数计算。</li>
                <li>• 分贝、地震震级、pH 值都是<b>对数刻度</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
