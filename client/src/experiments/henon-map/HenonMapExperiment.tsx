import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { henonMapNarration } from '../../narrations/scripts/henon-map'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { PARAMS } from './henonMap'
import { drawHenonMap } from './draw'

const W = 600
const H = 480

export default function HenonMapExperiment() {
  const [a, setA] = useState(1.4)
  const [b, setB] = useState(0.3)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(henonMapNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawHenonMap(canvas, a, b, 20000)
  }, [a, b])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">埃农映射</h1>
            <p className="text-gray-600">二维混沌吸引子</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">a = {a.toFixed(2)} · b = {b.toFixed(2)} · 吸引子点云</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-900" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">参数 a：{a.toFixed(2)}</h3>
              <input type="range" min={1.0} max={1.4} step={0.01} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-full" />
              <h3 className="text-lg font-semibold mb-3 mt-4">参数 b：{b.toFixed(2)}</h3>
              <input type="range" min={0.1} max={0.35} step={0.01} value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full" />
              <button onClick={() => { setA(PARAMS[0].a); setB(PARAMS[0].b) }} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🔄 恢复经典参数
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">概念与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 公式 <b>x' = 1 - a·x² + y</b>，<b>y' = b·x</b>。</li>
                <li>• 天文学家<b>埃农</b>1976 年提出，是最早的简单混沌模型之一。</li>
                <li>• 丢弃暂态后，轨道被吸入同一个<b>吸引子</b>。</li>
                <li>• 放大任意曲线仍见细线嵌套，这就是<b>自相似分形</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
