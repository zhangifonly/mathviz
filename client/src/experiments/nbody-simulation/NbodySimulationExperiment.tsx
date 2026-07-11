import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { nbodySimulationNarration } from '../../narrations/scripts/nbody-simulation'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { PRESET_OPTIONS, step, totalEnergy, type Body } from './nbodySimulation'
import { drawNbodySimulation, type NbodyDrawData } from './draw'

const TRAIL_LEN = 400

function viewRadiusOf(bodies: Body[]): number {
  let r = 0.5
  for (const b of bodies) r = Math.max(r, Math.abs(b.x), Math.abs(b.y))
  return r * 1.3
}

export default function NbodySimulationExperiment() {
  const [presetId, setPresetId] = useState(PRESET_OPTIONS[0].id)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [energy, setEnergy] = useState(0)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(nbodySimulationNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const preset = PRESET_OPTIONS.find((p) => p.id === presetId) ?? PRESET_OPTIONS[0]
    let bodies = preset.bodies.map((b) => ({ ...b }))
    const params = { G: preset.G, softening: preset.softening, dt: preset.dt }
    const trails: { x: number; y: number }[][] = bodies.map((b) => [{ x: b.x, y: b.y }])
    const viewRadius = viewRadiusOf(bodies)
    let raf = 0
    let frame = 0

    const tick = () => {
      // 每帧推进多个子步，加快演化
      for (let s = 0; s < 4; s++) bodies = step(bodies, params)
      bodies.forEach((b, i) => {
        trails[i].push({ x: b.x, y: b.y })
        if (trails[i].length > TRAIL_LEN) trails[i].shift()
      })
      const data: NbodyDrawData = { trails, bodies, viewRadius }
      drawNbodySimulation(canvas, data, 1)
      frame++
      if (frame % 15 === 0) setEnergy(totalEnergy(bodies, params.G, params.softening))
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
            <h1 className="text-2xl font-bold text-gray-800">🪐 N 体引力仿真</h1>
            <p className="text-gray-600">从两体的优雅到三体的混沌</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.label} · {info.bodies.length} 体</h3>
            <canvas ref={canvasRef} width={620} height={580} className="w-full rounded-lg bg-slate-900" />
            <p className="text-sm text-gray-500 mt-2">系统总能量 E ≈ {energy.toFixed(3)}（Verlet 积分下应基本稳定）</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择预设</h3>
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
              <h3 className="text-lg font-semibold mb-3">物理趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 引力大小 <b>F = G·m₁·m₂ / r²</b>，方向沿两体连线。</li>
                <li>• <b>两体问题</b>可完全解析求解，轨道是圆锥曲线。</li>
                <li>• <b>三体问题</b>一般无解析解，多数轨道呈<b>混沌</b>。</li>
                <li>• 八字轨道是三体问题罕见的<b>周期解</b>之一。</li>
                <li>• 好的数值积分（如 Verlet）能长期守恒<b>能量与动量</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
