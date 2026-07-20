import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { directionalDerivativeNarration } from '../../narrations/scripts/directional-derivative'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FUNCTIONS, fieldById, dirDeriv, gradMagnitude, SAMPLE_POINT } from './directionalDerivative'
import { drawDirectionalDerivative } from './draw'

const W = 600
const H = 480

export default function DirectionalDerivativeExperiment() {
  const [fieldId, setFieldId] = useState(FUNCTIONS[0].id)
  const [angleDeg, setAngleDeg] = useState(45)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(directionalDerivativeNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const field = fieldById(fieldId)
    const [px, py] = SAMPLE_POINT
    drawDirectionalDerivative(canvas, field, px, py, (angleDeg * Math.PI) / 180)
  }, [fieldId, angleDeg])

  const field = fieldById(fieldId)
  const [px, py] = SAMPLE_POINT
  const angle = (angleDeg * Math.PI) / 180
  const value = dirDeriv(field.f, px, py, angle)
  const maxVal = gradMagnitude(field.f, px, py)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">方向导数</h1>
            <p className="text-gray-600">任意方向的变化率</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{field.label} · 考察点 (1, 1) 的方向导数玫瑰图</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择函数</h3>
              <div className="space-y-2">
                {FUNCTIONS.map((fn) => (
                  <button
                    key={fn.id}
                    onClick={() => setFieldId(fn.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${fieldId === fn.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {fn.label}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">方向角 {angleDeg}°</h3>
              <input type="range" min={0} max={359} value={angleDeg} onChange={(e) => setAngleDeg(Number(e.target.value))} className="w-full accent-indigo-500" />
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <div>方向导数 D<sub>u</sub>f = <b className="text-indigo-600">{value.toFixed(3)}</b></div>
                <div>最大值 |∇f| = <b className="text-amber-600">{maxVal.toFixed(3)}</b>（梯度方向）</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• D<sub>u</sub>f = ∇f · u = |∇f| cos(夹角)。</li>
                <li>• 沿<b>梯度方向</b>变化最快，等于 |∇f|。</li>
                <li>• 与梯度<b>垂直</b>的方向导数为 0（沿等高线走）。</li>
                <li>• 反方向下降最快，值为 −|∇f|。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
