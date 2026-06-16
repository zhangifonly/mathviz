import { useState, useEffect, useRef, useCallback } from 'react'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { reactionDiffusionNarration } from '../../narrations/scripts/reaction-diffusion'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { createField, step, renderToImageData, RD_PRESETS, type Field } from './grayScott'

const W = 160
const H = 120
const Du = 0.16
const Dv = 0.08
const STEPS_PER_FRAME = 8

export default function ReactionDiffusionExperiment() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [running, setRunning] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fieldRef = useRef<Field>(createField(W, H))
  const presetRef = useRef(RD_PRESETS[0])

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit: handleExitPresenter } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(reactionDiffusionNarration)
  }, [narration])

  const reset = useCallback((idx: number) => {
    presetRef.current = RD_PRESETS[idx]
    fieldRef.current = createField(W, H)
  }, [])

  // 模拟 + 渲染循环
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = ctx.createImageData(W, H)
    let raf = 0
    const loop = () => {
      if (running) {
        const p = { Du, Dv, feed: presetRef.current.feed, kill: presetRef.current.kill }
        for (let s = 0; s < STEPS_PER_FRAME; s++) {
          fieldRef.current = step(fieldRef.current, p)
        }
      }
      renderToImageData(fieldRef.current, img.data)
      ctx.putImageData(img, 0, 0)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [running])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExitPresenter} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">反应扩散与图灵斑图</h1>
            <p className="text-gray-600">化学反应如何自组织出动物花纹</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">图案生长（{RD_PRESETS[presetIdx].label}）</h3>
            </div>
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              className="w-full rounded border border-gray-300 bg-slate-900"
              style={{ imageRendering: 'pixelated', aspectRatio: `${W}/${H}` }}
            />
            <p className="text-xs text-gray-500 mt-2">两种化学物在网格上扩散并反应，从随机扰动中自发生长出稳定的空间图案。</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">控制</h3>
              <button
                onClick={() => setRunning((r) => !r)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-white mb-2 ${running ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              >{running ? '⏸ 暂停' : '▶ 继续'}</button>
              <button
                onClick={() => reset(presetIdx)}
                className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
              >↺ 重新生长</button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">图案类型</h3>
              <div className="space-y-2">
                {RD_PRESETS.map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => { setPresetIdx(i); reset(i) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${i === presetIdx ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >{p.label}</button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">Gray-Scott 方程</h3>
              <div className="p-3 bg-indigo-50 rounded-lg space-y-2 text-sm">
                <MathFormula formula="\frac{\partial u}{\partial t} = D_u \nabla^2 u - uv^2 + f(1-u)" />
                <MathFormula formula="\frac{\partial v}{\partial t} = D_v \nabla^2 v + uv^2 - (f+k)v" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                补给率 f={RD_PRESETS[presetIdx].feed}、消亡率 k={RD_PRESETS[presetIdx].kill}。微小的参数差异就会导致截然不同的图案，这正是图灵 1952 年提出的形态发生机制。
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
