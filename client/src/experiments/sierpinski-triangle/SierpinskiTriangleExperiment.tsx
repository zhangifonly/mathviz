import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { sierpinskiTriangleNarration } from '../../narrations/scripts/sierpinski-triangle'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { LEVELS, MODES, type Mode } from './sierpinskiTriangle'
import { drawSierpinskiTriangle } from './draw'

const W = 600
const H = 480

const MODE_LABELS: Record<Mode, string> = { recursive: '递归挖洞', chaos: '混沌游戏' }

export default function SierpinskiTriangleExperiment() {
  const [mode, setMode] = useState<Mode>('recursive')
  const [level, setLevel] = useState(4)
  const [seed, setSeed] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(sierpinskiTriangleNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawSierpinskiTriangle(canvas, mode, level, seed)
  }, [mode, level, seed])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">谢尔宾斯基三角</h1>
            <p className="text-gray-600">挖洞与混沌游戏</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{MODE_LABELS[mode]} · 第 {level} 层</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">生成方式</h3>
              <div className="space-y-2">
                {MODES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${mode === m ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {MODE_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">迭代层数</h3>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setLevel(n)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${level === n ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {mode === 'chaos' && (
                <button onClick={() => setSeed((s) => s + 1)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-pink-100 text-pink-700 hover:bg-pink-200">
                  🎲 重新随机
                </button>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 第 n 层由 <b>3ⁿ</b> 个小三角组成，面积趋于零。</li>
                <li>• 它的<b>分形维数</b>约 1.585，介于线与面之间。</li>
                <li>• 混沌游戏用纯随机点竟画出同一图形。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
