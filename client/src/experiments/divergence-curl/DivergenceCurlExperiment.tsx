import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { divergenceCurlNarration } from '../../narrations/scripts/divergence-curl'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FIELDS, getField, GRID_SIZES, type FieldId } from './divergenceCurl'
import { drawDivergenceCurl } from './draw'

const W = 600
const H = 480

export default function DivergenceCurlExperiment() {
  const [fieldId, setFieldId] = useState<FieldId>('source')
  const [grid, setGrid] = useState(11)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(divergenceCurlNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawDivergenceCurl(canvas, getField(fieldId), grid, true)
  }, [fieldId, grid])

  const current = getField(fieldId)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">散度与旋度</h1>
            <p className="text-gray-600">向量场的源与涡</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{current.name} · {current.desc}</h3>
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
                    {f.name} · {f.desc}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">箭头密度</h3>
              <div className="flex gap-2">
                {GRID_SIZES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrid(g)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${grid === g ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                  >
                    {g}×{g}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• <b>散度</b>=∂P/∂x+∂Q/∂y，正为<span className="text-red-500">源</span>负为<span className="text-blue-500">汇</span>。</li>
                <li>• <b>旋度</b>=∂Q/∂x-∂P/∂y，正逆时针负顺时针。</li>
                <li>• 标注点用数值中心差分实时计算。</li>
                <li>• 电磁与流体的基本定律都用散度旋度书写。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
