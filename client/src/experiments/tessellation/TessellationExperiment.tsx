import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { tessellationNarration } from '../../narrations/scripts/tessellation'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { TILINGS, interiorAngle, type TilingType } from './tessellation'
import { drawTessellation } from './draw'

const W = 600
const H = 480

const LABELS: Record<TilingType, string> = {
  triangle: '正三角形',
  square: '正方形',
  hexagon: '正六边形',
}
const SIDES: Record<TilingType, number> = { triangle: 3, square: 4, hexagon: 6 }

export default function TessellationExperiment() {
  const [type, setType] = useState<TilingType>('hexagon')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(tessellationNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawTessellation(canvas, type, 42)
  }, [type])

  const n = SIDES[type]

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">密铺镶嵌</h1>
            <p className="text-gray-600">用多边形铺满平面</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{LABELS[type]}密铺 · 内角 {interiorAngle(n)}°</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">密铺类型</h3>
              <div className="space-y-2">
                {TILINGS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${type === t ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {LABELS[t]}（内角 {interiorAngle(SIDES[t])}°）
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 密铺 = 不留缝、不重叠地<b>铺满</b>平面。</li>
                <li>• 顶点处所有角相加必须正好是 <b>360°</b>。</li>
                <li>• 单一正多边形只有<b>三、四、六</b>边形能密铺。</li>
                <li>• 正六边形密铺就是<b>蜂巢</b>，最省材料。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
