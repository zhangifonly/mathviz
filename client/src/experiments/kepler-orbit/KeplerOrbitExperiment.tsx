import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { keplerOrbitNarration } from '../../narrations/scripts/kepler-orbit'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { ECCENTRICITIES } from './keplerOrbit'
import { drawKeplerOrbit } from './draw'

const W = 600
const H = 480
const A = 1

export default function KeplerOrbitExperiment() {
  const [ecc, setEcc] = useState(0.6)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tRef = useRef(0)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(keplerOrbitNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      tRef.current = (tRef.current + dt / 8) % 1
      drawKeplerOrbit(canvas, A, ecc, tRef.current, 12)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [ecc])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">开普勒轨道</h1>
            <p className="text-gray-600">行星椭圆与面积定律</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">离心率 e = {ecc.toFixed(1)} · 等时扇形面积相等</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">离心率 e</h3>
              <div className="space-y-2">
                {ECCENTRICITIES.map((n) => (
                  <button
                    key={n}
                    onClick={() => setEcc(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${ecc === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    e = {n.toFixed(1)}{n === 0.1 ? '（近圆）' : n === 0.8 ? '（很扁）' : ''}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 轨道是<b>椭圆</b>，太阳位于一个<b>焦点</b>上。</li>
                <li>• 开普勒方程 <b>M = E − e·sinE</b>，牛顿迭代解偏近点角。</li>
                <li>• 相等时间扫过<b>相等面积</b>，近日点快、远日点慢。</li>
                <li>• 离心率 e 越大，轨道越扁，速度变化越明显。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
