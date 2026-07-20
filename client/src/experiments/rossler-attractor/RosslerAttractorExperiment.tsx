import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { rosslerAttractorNarration } from '../../narrations/scripts/rossler-attractor'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { simulate, ROSSLER_PRESETS } from './rosslerAttractor'
import { drawRosslerAttractor } from './draw'

const STEPS = 9000
const DT = 0.02

export default function RosslerAttractorExperiment() {
  const [presetId, setPresetId] = useState('classic')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(rosslerAttractorNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const preset = ROSSLER_PRESETS.find((p) => p.id === presetId) ?? ROSSLER_PRESETS[0]
    const pts = simulate({ x: 1, y: 1, z: 1 }, preset.params, STEPS, DT)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.006)
      drawRosslerAttractor(canvas, pts, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [presetId])

  const info = ROSSLER_PRESETS.find((p) => p.id === presetId)!

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Rössler吸引子 🌀</h1>
            <p className="text-gray-600">螺旋盘绕又猛然折叠的极简混沌</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.label} · x-y 投影</h3>
            <canvas ref={canvasRef} width={600} height={480} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择参数</h3>
              <div className="space-y-2">
                {ROSSLER_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPresetId(p.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${presetId === p.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{p.label}</div>
                    <div className={`text-xs ${presetId === p.id ? 'text-indigo-100' : 'text-indigo-400'}`}>{p.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">混沌趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• Rössler 系统只有<b>一个</b>非线性项，比洛伦兹更简单。</li>
                <li>• 轨迹在平面上<b>螺旋外扩</b>，再被 z 方向猛地<b>折叠</b>拉回。</li>
                <li>• 拉伸与折叠反复进行，正是<b>混沌</b>的几何机制。</li>
                <li>• 增大参数 c，系统经<b>周期倍化</b>一步步走向混沌。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
