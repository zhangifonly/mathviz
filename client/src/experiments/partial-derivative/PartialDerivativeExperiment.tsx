import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { partialDerivativeNarration } from '../../narrations/scripts/partial-derivative'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FUNCTIONS, gradient } from './partialDerivative'
import { drawPartialDerivative, DOMAIN } from './draw'

const W = 600
const H = 480

export default function PartialDerivativeExperiment() {
  const [fnId, setFnId] = useState(FUNCTIONS[0].id)
  const [point, setPoint] = useState<[number, number]>([1.2, 0.8])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(partialDerivativeNarration)
  }, [narration])

  const def = FUNCTIONS.find((d) => d.id === fnId) ?? FUNCTIONS[0]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPartialDerivative(canvas, def, point[0], point[1], 3)
  }, [def, point])

  const [gx, gy] = gradient(def.f, point[0], point[1])

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current
    if (!c) return
    const rect = c.getBoundingClientRect()
    const nx = ((e.clientX - rect.left) / rect.width) * 2 * DOMAIN - DOMAIN
    const ny = DOMAIN - ((e.clientY - rect.top) / rect.height) * 2 * DOMAIN
    setPoint([Number(nx.toFixed(2)), Number(ny.toFixed(2))])
  }

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">偏导数与梯度</h1>
            <p className="text-gray-600">多元函数的变化率</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{def.name} · 点击图上任意点看梯度</h3>
            <canvas ref={canvasRef} width={W} height={H} onClick={onCanvasClick} className="w-full rounded-lg bg-slate-50 cursor-crosshair" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择曲面</h3>
              <div className="space-y-2">
                {FUNCTIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setFnId(d.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${fnId === d.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">当前点的梯度</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 点坐标 ≈ ({point[0]}, {point[1]})</li>
                <li>• ∂f/∂x ≈ <b>{gx.toFixed(2)}</b></li>
                <li>• ∂f/∂y ≈ <b>{gy.toFixed(2)}</b></li>
                <li>• 梯度模长 ≈ <b>{Math.hypot(gx, gy).toFixed(2)}</b>（坡度）</li>
                <li>• 白色箭头垂直于等高线，指向<b>上升最陡</b>方向。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
