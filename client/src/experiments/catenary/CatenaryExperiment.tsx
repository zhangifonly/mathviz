import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { catenaryNarration } from '../../narrations/scripts/catenary'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { A_VALUES, arcLength, sag } from './catenary'
import { drawCatenary } from './draw'

const W = 600
const H = 480

export default function CatenaryExperiment() {
  const [a, setA] = useState(70)
  const [showParabola, setShowParabola] = useState(true)
  const [invert, setInvert] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(catenaryNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawCatenary(canvas, a, showParabola, invert)
  }, [a, showParabola, invert])

  const halfSpan = W * 0.4
  const len = arcLength(a, halfSpan).toFixed(0)
  const dip = sag(a, halfSpan).toFixed(0)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">悬链线</h1>
            <p className="text-gray-600">双曲余弦的曲线</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">a = {a} · 弧长 ≈ {len} · 下垂 ≈ {dip}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">参数 a（曲率）</h3>
              <div className="space-y-2">
                {A_VALUES.map((v) => (
                  <button
                    key={v}
                    onClick={() => setA(v)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${a === v ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    a = {v} {v === A_VALUES[0] ? '（深）' : v === A_VALUES[A_VALUES.length - 1] ? '（平坦）' : ''}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowParabola((s) => !s)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-orange-100 text-orange-700 hover:bg-orange-200">
                {showParabola ? '隐藏' : '显示'}对比抛物线
              </button>
              <button onClick={() => setInvert((s) => !s)} className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                {invert ? '恢复下垂链条' : '倒置成最优拱'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 方程 <b>y = a·cosh(x/a)</b>，a 越小曲线越深。</li>
                <li>• 看着像<b>抛物线</b>，但两端上升更快，本质不同。</li>
                <li>• 弧长有闭式 <b>2a·sinh(x₀/a)</b>。</li>
                <li>• 倒置后成为<b>纯受压</b>的最优拱，高迪的圣家堂据此设计。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
