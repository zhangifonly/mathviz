import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { sierpinskiCarpetNarration } from '../../narrations/scripts/sierpinski-carpet'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { LEVELS, squareCount, fractalDimension } from './sierpinskiCarpet'
import { drawSierpinskiCarpet } from './draw'

const W = 600
const H = 480

export default function SierpinskiCarpetExperiment() {
  const [level, setLevel] = useState(3)
  const [showGrid, setShowGrid] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(sierpinskiCarpetNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawSierpinskiCarpet(canvas, level, showGrid)
  }, [level, showGrid])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">谢尔宾斯基地毯</h1>
            <p className="text-gray-600">二维挖洞分形</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">第 {level} 层 · {squareCount(level).toLocaleString()} 个方格</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">迭代层数</h3>
              <div className="space-y-2">
                {LEVELS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setLevel(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${level === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    第 {n} 层（8^{n} = {squareCount(n).toLocaleString()} 格）
                  </button>
                ))}
              </div>
              <button onClick={() => setShowGrid((g) => !g)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                {showGrid ? '隐藏' : '显示'}网格线
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">知识卡片</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 每步把正方形切成 <b>3x3</b>，挖去正中心格。</li>
                <li>• 余下 <b>8</b> 格各自递归，第 n 层共 <b>8ⁿ</b> 个方格。</li>
                <li>• 分数维数 = log8 / log3 ≈ <b>{fractalDimension().toFixed(4)}</b>。</li>
                <li>• 面积按 (8/9)ⁿ 缩小，层数趋于无穷时<b>趋于零</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
