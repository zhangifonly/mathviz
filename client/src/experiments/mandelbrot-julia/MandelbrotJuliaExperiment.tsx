import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { mandelbrotJuliaNarration } from '../../narrations/scripts/mandelbrot-julia'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { JULIA_OPTIONS } from './mandelbrotJulia'
import { drawMandelbrotJulia, type FractalData } from './draw'

type Mode = 'mandelbrot' | 'julia'
const MAX_ITER = 160

export default function MandelbrotJuliaExperiment() {
  const [mode, setMode] = useState<Mode>('mandelbrot')
  const [juliaIdx, setJuliaIdx] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(mandelbrotJuliaNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const opt = JULIA_OPTIONS[juliaIdx]
    const data: FractalData =
      mode === 'mandelbrot'
        ? { mode, cx: 0, cy: 0, centerX: -0.5, centerY: 0, scale: 1.3, maxIter: MAX_ITER }
        : { mode, cx: opt.cx, cy: opt.cy, centerX: 0, centerY: 0, scale: 1.5, maxIter: MAX_ITER }
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.06)
      drawMandelbrotJulia(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mode, juliaIdx])

  const opt = JULIA_OPTIONS[juliaIdx]

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">曼德博与朱利亚集</h1>
            <p className="text-gray-600">一条平方迭代 z² + c 生长出的分形宇宙</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              {mode === 'mandelbrot' ? '曼德博集（参数平面）' : `朱利亚集 · ${opt.label}`}
            </h3>
            <canvas ref={canvasRef} width={600} height={560} className="w-full rounded-lg bg-slate-900" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择模式</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setMode('mandelbrot')} className={`px-3 py-2 rounded-lg text-sm font-medium ${mode === 'mandelbrot' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>曼德博集</button>
                <button onClick={() => setMode('julia')} className={`px-3 py-2 rounded-lg text-sm font-medium ${mode === 'julia' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>朱利亚集</button>
              </div>
            </div>
            {mode === 'julia' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-3">参数 c</h3>
                <div className="space-y-2">
                  {JULIA_OPTIONS.map((o, i) => (
                    <button
                      key={o.label}
                      onClick={() => setJuliaIdx(i)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${juliaIdx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                    >
                      <div>{o.label}</div>
                      <div className={`text-xs ${juliaIdx === i ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">分形趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 曼德博集固定初值 <b>z₀ = 0</b>，让参数 <b>c</b> 扫过整个复平面。</li>
                <li>• 朱利亚集固定 <b>c</b>，让初值 <b>z₀</b> 扫过复平面。</li>
                <li>• 逃逸判据：模长超过 <b>2</b> 就必然奔向无穷。</li>
                <li>• c 在曼德博集<b>内</b>时朱利亚集连通，<b>外</b>时碎成尘埃。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
