import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { stokesTheoremNarration } from '../../narrations/scripts/stokes-theorem'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FIELDS, REGIONS } from './stokesTheorem'
import { drawStokesTheorem } from './draw'

const W = 600
const H = 480

export default function StokesTheoremExperiment() {
  const [fieldId, setFieldId] = useState(FIELDS[0].id)
  const [regionId, setRegionId] = useState(REGIONS[0].id)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(stokesTheoremNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const field = FIELDS.find((f) => f.id === fieldId) ?? FIELDS[0]
    const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0]
    drawStokesTheorem(canvas, field, region, true)
  }, [fieldId, regionId])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">斯托克斯定理</h1>
            <p className="text-gray-600">边界环量等于内部旋度</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">向量场 · 闭合边界 · 旋度热力图</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择向量场</h3>
              <div className="space-y-2">
                {FIELDS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFieldId(f.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${fieldId === f.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">积分区域</h3>
              <div className="flex gap-2">
                {REGIONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRegionId(r.id)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${regionId === r.id ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">定理与看点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 紫色边界的<b>环量</b> ∮F·dr（数值线积分）。</li>
                <li>• 区域内<b>旋度</b>二重积分 ∬(∂Q/∂x−∂P/∂y)dA（红蓝热力图）。</li>
                <li>• 无论怎么切场换区域，两个数值<b>始终相等</b>。</li>
                <li>• 这正是格林定理，也是斯托克斯定理的平面特例。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
