import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { doublePendulumNarration } from '../../narrations/scripts/double-pendulum'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { rk4Step, PRESET_OPTIONS, DEFAULT_PARAMS } from './doublePendulum'
import { drawDoublePendulum, bobScreenPos, type TrailPoint } from './draw'

const DT = 0.008
const SUBSTEPS = 3
const MAX_TRAIL = 500

export default function DoublePendulumExperiment() {
  const [presetId, setPresetId] = useState('chaotic')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(doublePendulumNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const opt = PRESET_OPTIONS.find((o) => o.id === presetId) ?? PRESET_OPTIONS[1]
    let state = { ...opt.state }
    const trail: TrailPoint[] = []
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.04)
      for (let i = 0; i < SUBSTEPS; i++) state = rk4Step(state, DEFAULT_PARAMS, DT)
      trail.push(bobScreenPos(canvas, state, DEFAULT_PARAMS))
      if (trail.length > MAX_TRAIL) trail.shift()
      drawDoublePendulum(canvas, { state, trail, params: DEFAULT_PARAMS }, progress)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [presetId])

  const info = PRESET_OPTIONS.find((o) => o.id === presetId)!

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">双摆混沌</h1>
            <p className="text-gray-600">最简单的结构，最难预测的运动</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.label} · 实时模拟</h3>
            <canvas ref={canvasRef} width={600} height={560} className="w-full rounded-lg bg-slate-900" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择初始状态</h3>
              <div className="space-y-2">
                {PRESET_OPTIONS.map((o) => (
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
              <h3 className="text-lg font-semibold mb-3">混沌趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 双摆只有<b>两个自由度</b>，却是经典的<b>混沌</b>系统。</li>
                <li>• 运动方程由<b>拉格朗日力学</b>推出，高度<b>非线性</b>耦合。</li>
                <li>• 我们用<b>四阶龙格库塔</b>数值积分实时求解。</li>
                <li>• 初值差<b>万分之一</b>，轨迹很快就完全不同，这就是<b>蝴蝶效应</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
