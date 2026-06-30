import { useState, useEffect, useRef } from 'react'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { lissajousNarration } from '../../narrations/scripts/lissajous'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { buildFigure, FIGURE_INFO, type FigureKind } from './lissajous'
import { drawFigure } from './draw'

export default function LissajousExperiment() {
  const [kind, setKind] = useState<FigureKind>('lissajous-3-2')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(lissajousNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const pts = buildFigure(kind)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.004)
      drawFigure(canvas, pts, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [kind])

  const info = FIGURE_INFO.find((f) => f.kind === kind)!

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">利萨茹与玫瑰曲线</h1>
            <p className="text-gray-600">频率与角度编织出的对称花纹</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.label} · 描线动画</h3>
            <canvas ref={canvasRef} width={560} height={520} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择图形</h3>
              <div className="space-y-2">
                {FIGURE_INFO.map((f) => (
                  <button
                    key={f.kind}
                    onClick={() => setKind(f.kind)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${kind === f.kind ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">公式</h3>
              <div className="p-3 bg-indigo-50 rounded-lg text-sm">
                <MathFormula formula={kind.startsWith('rose') ? 'r = \\cos(k\\theta)' : 'x=\\sin(at+\\delta),\\ y=\\sin(bt)'} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">图形趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• <b>利萨茹图形</b>由两个垂直方向的简谐振动合成，示波器上常见。</li>
                <li>• 频率比 a:b 是简单整数时，图形闭合且稳定。</li>
                <li>• <b>玫瑰曲线</b> r=cos(kθ)：k 为奇数有 k 个花瓣，偶数有 2k 个。</li>
                <li>• 相位差 δ 改变利萨茹图形的"扭转"程度。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
