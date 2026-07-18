import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { lineIntegralNarration } from '../../narrations/scripts/line-integral'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FIELDS, PATHS, getField, getPath, lineIntegral2, lineIntegral1 } from './lineIntegral'
import { drawLineIntegral } from './draw'

const W = 600
const H = 480

export default function LineIntegralExperiment() {
  const [fieldId, setFieldId] = useState('rotation')
  const [pathId, setPathId] = useState('arc')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(lineIntegralNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawLineIntegral(canvas, getField(fieldId), getPath(pathId))
  }, [fieldId, pathId])

  const field = getField(fieldId)
  const path = getPath(pathId)
  const work = lineIntegral2(field, path)
  const arc = lineIntegral1(field, path)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">曲线积分</h1>
            <p className="text-gray-600">沿路径累加做功</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{field.name} · {path.name} 路径</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            <p className="text-xs text-gray-500 mt-2">红色=顺场做正功，蓝色=逆场做负功；绿点起点，紫点终点。</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择向量场</h3>
              <div className="space-y-2">
                {FIELDS.map((f) => (
                  <button key={f.id} onClick={() => setFieldId(f.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${fieldId === f.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    {f.name}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mb-3 mt-4">选择路径</h3>
              <div className="space-y-2">
                {PATHS.map((p) => (
                  <button key={p.id} onClick={() => setPathId(p.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${pathId === p.id ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">积分值</h3>
              <p className="text-sm text-gray-700">第二类 ∫F·dr = <b className={work >= 0 ? 'text-red-600' : 'text-blue-600'}>{work.toFixed(3)}</b></p>
              <p className="text-sm text-gray-700">第一类 ∫|F|ds = <b>{arc.toFixed(3)}</b></p>
              <ul className="text-sm text-gray-600 space-y-1.5 mt-3">
                <li>• 第二类积分即向量场沿路径所做的功。</li>
                <li>• 旋转场沿圆弧顺切向，功为正且可观。</li>
                <li>• 径向场与圆弧切向垂直，做功恰为零。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
