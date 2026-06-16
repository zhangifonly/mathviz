import { useState, useEffect, useRef, useCallback } from 'react'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { threeBodyNarration } from '../../narrations/scripts/three-body'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { stepVerlet, totalEnergy, type Body } from './physics'
import { PRESETS, clonePreset, BODY_COLORS } from './presets'

const DT = 0.005
const SUBSTEPS = 4 // 每帧子步数，提升精度
const SCALE = 68   // 世界坐标到像素（取值兼顾各构型最大轨道半径不超出画布）

export default function ThreeBodyExperiment() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [running, setRunning] = useState(false)
  const [showTrails, setShowTrails] = useState(true)
  const [energy, setEnergy] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bodiesRef = useRef<Body[]>(clonePreset(PRESETS[0]))
  const trailsRef = useRef<{ x: number; y: number }[][]>([[], [], []])
  const rafRef = useRef<number | null>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit: handleExitPresenter } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(threeBodyNarration)
  }, [narration])

  const resetSim = useCallback((idx: number) => {
    bodiesRef.current = clonePreset(PRESETS[idx])
    trailsRef.current = PRESETS[idx].bodies.map(() => [])
    setEnergy(totalEnergy(bodiesRef.current, { G: PRESETS[idx].G, softening: 0.05 }))
  }, [])

  // 模拟 + 绘制循环
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const cfg = { G: PRESETS[presetIdx].G, softening: 0.05 }
    const W = canvas.width
    const H = canvas.height

    const draw = () => {
      if (running) {
        for (let s = 0; s < SUBSTEPS; s++) {
          bodiesRef.current = stepVerlet(bodiesRef.current, DT, cfg)
        }
        const bodies = bodiesRef.current
        bodies.forEach((b, i) => {
          const trail = trailsRef.current[i]
          trail.push({ x: b.x, y: b.y })
          if (trail.length > 600) trail.shift()
        })
      }
      // 背景
      ctx.fillStyle = '#0a0f1e'
      ctx.fillRect(0, 0, W, H)
      const cx = W / 2
      const cy = H / 2
      // 轨迹
      if (showTrails) {
        trailsRef.current.forEach((trail, i) => {
          ctx.strokeStyle = BODY_COLORS[i] + '88'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          trail.forEach((p, k) => {
            const px = cx + p.x * SCALE
            const py = cy - p.y * SCALE
            if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
          })
          ctx.stroke()
        })
      }
      // 天体
      bodiesRef.current.forEach((b, i) => {
        const px = cx + b.x * SCALE
        const py = cy - b.y * SCALE
        const r = 4 + Math.sqrt(b.mass) * 2.5
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 2)
        grad.addColorStop(0, BODY_COLORS[i])
        grad.addColorStop(1, BODY_COLORS[i] + '00')
        ctx.fillStyle = grad
        ctx.beginPath(); ctx.arc(px, py, r * 2, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = BODY_COLORS[i]
        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill()
      })
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [running, showTrails, presetIdx])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExitPresenter} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">三体引力轨道</h1>
            <p className="text-gray-600">牛顿引力下天体的混沌之舞</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">引力轨道模拟</h3>
              <span className="text-sm text-gray-600">系统总能量 <span className="font-mono font-bold text-indigo-600">{energy.toFixed(3)}</span></span>
            </div>
            <canvas
              ref={canvasRef}
              width={760}
              height={560}
              className="w-full rounded border border-gray-300 bg-slate-900"
            />
            <p className="text-xs text-gray-500 mt-2">总能量在理想情况下应保持守恒，可用来检验数值积分的精度。</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">控制</h3>
              <button
                onClick={() => setRunning((r) => !r)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-white mb-2 ${running ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              >{running ? '⏸ 暂停' : '▶ 开始'}</button>
              <button
                onClick={() => { resetSim(presetIdx); setRunning(false) }}
                className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 mb-2"
              >↺ 重置</button>
              <label className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <input type="checkbox" checked={showTrails} onChange={(e) => setShowTrails(e.target.checked)} />
                显示运动轨迹
              </label>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">初始构型</h3>
              <div className="space-y-2">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => { setPresetIdx(i); resetSim(i); setRunning(false) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${i === presetIdx ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >{p.label}</button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">万有引力定律</h3>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <MathFormula formula="F = G\frac{m_1 m_2}{r^2}" />
              </div>
              <p className="text-sm text-gray-600 mt-2">三体问题没有一般的解析解，对初始条件极其敏感，这正是混沌的标志。</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
