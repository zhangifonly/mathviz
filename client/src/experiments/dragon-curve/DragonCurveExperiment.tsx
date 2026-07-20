import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { dragonCurveNarration } from '../../narrations/scripts/dragon-curve'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { ITERATIONS } from './dragonCurve'
import { drawDragonCurve } from './draw'

const W = 600
const H = 480

export default function DragonCurveExperiment() {
  const [iterations, setIterations] = useState(12)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(dragonCurveNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawDragonCurve(canvas, iterations)
  }, [iterations])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">龙形曲线</h1>
            <p className="text-gray-600">折纸展开的分形</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">第 {iterations} 次迭代 · 转向序列走出的龙</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">迭代次数</h3>
              <div className="space-y-2">
                {ITERATIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setIterations(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${iterations === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    对折 {n} 次（{Math.pow(2, n)} 段）
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">应用与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 转向序列由<b>折叠递推</b>生成，中间永远是一道谷折。</li>
                <li>• 曲线<b>永不自交</b>，迭代越多越能铺满整片区域。</li>
                <li>• 它是经典的<b>自相似分形</b>，局部与整体如出一辙。</li>
                <li>• 因在《侏罗纪公园》书页角标出现，又称<b>龙王分形</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
