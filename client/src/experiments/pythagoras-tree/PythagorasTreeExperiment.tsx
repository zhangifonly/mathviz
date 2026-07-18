import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { pythagorasTreeNarration } from '../../narrations/scripts/pythagoras-tree'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { squareCount, DEPTHS } from './pythagorasTree'
import { drawPythagorasTree } from './draw'

const W = 600
const H = 480

export default function PythagorasTreeExperiment() {
  const [depth, setDepth] = useState(9)
  const [angle, setAngle] = useState(45)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(pythagorasTreeNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPythagorasTree(canvas, depth, angle)
  }, [depth, angle])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">毕达哥拉斯树</h1>
            <p className="text-gray-600">勾股定理生长出的分形</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">深度 {depth} · 共 {squareCount(depth)} 个正方形</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">递归深度</h3>
              <div className="space-y-2">
                {DEPTHS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDepth(d)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${depth === d ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    深度 {d}（{squareCount(d)} 个正方形）
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">三角形倾角：{angle}°</h3>
              <input
                type="range"
                min={20}
                max={70}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 顶边上的<b>直角三角形</b>正是勾股定理的图形。</li>
                <li>• 每递归一层，正方形数量<b>翻一倍</b>。</li>
                <li>• 深度 n 共有 <b>2^(n+1)-1</b> 个正方形。</li>
                <li>• 局部与整体相似，是典型的<b>分形</b>结构。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
