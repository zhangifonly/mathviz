import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { kalmanFilterNarration } from '../../narrations/scripts/kalman-filter'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { generateDataset, NOISE_OPTIONS } from './kalmanFilter'
import { drawKalmanFilter } from './draw'

const N = 140

export default function KalmanFilterExperiment() {
  const [presetId, setPresetId] = useState('balanced')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(kalmanFilterNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const opt = NOISE_OPTIONS.find((o) => o.id === presetId) ?? NOISE_OPTIONS[1]
    const data = generateDataset(N, opt.Q, opt.R)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawKalmanFilter(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [presetId])

  const info = NOISE_OPTIONS.find((o) => o.id === presetId)!

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">卡尔曼滤波</h1>
            <p className="text-gray-600">在噪声里追踪真相的最优估计</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.label} · Q={info.Q} R={info.R}</h3>
            <canvas ref={canvasRef} width={720} height={520} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">噪声预设</h3>
              <div className="space-y-2">
                {NOISE_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setPresetId(o.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${presetId === o.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${presetId === o.id ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理速览</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 预测：估计不变，方差加上<b>过程噪声 Q</b>。</li>
                <li>• 更新：算<b>卡尔曼增益 K</b> = P /（P + R）。</li>
                <li>• 融合：新估计 = 预测 + K ×（测量 − 预测）。</li>
                <li>• 融合后方差必然<b>收缩</b>，置信带越来越窄。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
