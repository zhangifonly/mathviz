import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { vectorCalculusFieldNarration } from '../../narrations/scripts/vector-calculus-field'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FIELDS, START, END, workAlongPath, straightPath, cornerPath } from './vectorCalculusField'
import { drawVectorCalculusField } from './draw'

const W = 600
const H = 480

export default function VectorCalculusFieldExperiment() {
  const [fieldIdx, setFieldIdx] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(vectorCalculusFieldNarration)
  }, [narration])

  const field = FIELDS[fieldIdx]
  const wLine = workAlongPath(field, straightPath(START, END))
  const wCorner = workAlongPath(field, cornerPath(START, END))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawVectorCalculusField(canvas, field, { showEquipotential: true, showPaths: true })
  }, [field])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">保守场与势函数</h1>
            <p className="text-gray-600">做功只依赖起终点</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{field.name} · 红=直线 绿=折线</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择向量场</h3>
              <div className="space-y-2">
                {FIELDS.map((f, i) => (
                  <button
                    key={f.id}
                    onClick={() => setFieldIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${fieldIdx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">两条路径做功对比</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>红色直线路径 W = <b>{wLine.toFixed(3)}</b></li>
                <li>绿色折线路径 W = <b>{wCorner.toFixed(3)}</b></li>
                <li>差值 = <b>{Math.abs(wLine - wCorner).toFixed(3)}</b></li>
                <li className={field.conservative ? 'text-emerald-600' : 'text-rose-600'}>
                  {field.conservative ? '保守场：两路径相等，做功与路径无关。' : '非保守场：两路径不等，做功依赖路径。'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
