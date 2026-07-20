import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { cantorSetNarration } from '../../narrations/scripts/cantor-set'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { LEVELS, remainingLength, segmentCount, cantorDimension } from './cantorSet'
import { drawCantorSet } from './draw'

const W = 600
const H = 480

export default function CantorSetExperiment() {
  const [levels, setLevels] = useState(5)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(cantorSetNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawCantorSet(canvas, levels)
  }, [levels])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">康托三分集</h1>
            <p className="text-gray-600">测度为零的不可数集</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">挖到第 {levels} 层 · 逐层堆叠</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">迭代层数</h3>
              <div className="space-y-2">
                {LEVELS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setLevels(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${levels === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    挖去 {n} 层
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">当前层数据</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 线段条数：<b>{segmentCount(levels)}</b> 段</li>
                <li>• 剩余总长度：<b>{remainingLength(levels).toFixed(4)}</b></li>
                <li>• 每段长度：<b>(1/3)^{levels}</b></li>
                <li>• 分形维数：<b>log2/log3 ≈ {cantorDimension().toFixed(4)}</b></li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 挖到无穷时，剩余长度趋于 <b>0</b>。</li>
                <li>• 但集合里的点却和整条实数线一样<b>多</b>。</li>
                <li>• 用三进制看，它正是只含 0 和 2 的所有小数。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
