import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { projectileMotionNarration } from '../../narrations/scripts/projectile-motion'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { range, maxHeight, flightTime, ANGLES } from './projectileMotion'
import { drawProjectileMotion } from './draw'

const W = 600
const H = 480
const SPEEDS = [15, 20, 25]

export default function ProjectileMotionExperiment() {
  const [v0, setV0] = useState(20)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(projectileMotionNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawProjectileMotion(canvas, v0, ANGLES, 9.8)
  }, [v0])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">抛体运动</h1>
            <p className="text-gray-600">抛物线轨迹</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">初速 {v0} m/s · 不同发射角轨迹</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">初速度</h3>
              <div className="space-y-2">
                {SPEEDS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setV0(v)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${v0 === v ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {v} m/s
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">各角度数据</h3>
              <table className="w-full text-sm text-gray-600">
                <thead>
                  <tr className="text-gray-400"><th className="text-left">角度</th><th className="text-right">射程</th><th className="text-right">高度</th><th className="text-right">时间</th></tr>
                </thead>
                <tbody>
                  {ANGLES.map((a) => (
                    <tr key={a} className={a === 45 ? 'font-bold text-orange-600' : ''}>
                      <td className="text-left">{a}°</td>
                      <td className="text-right">{range(v0, a).toFixed(1)}</td>
                      <td className="text-right">{maxHeight(v0, a).toFixed(1)}</td>
                      <td className="text-right">{flightTime(v0, a).toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 mt-2">45° 射程最远（射程 = v0² sin2θ / g）</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
