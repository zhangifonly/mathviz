import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { montyHallNarration } from '../../narrations/scripts/monty-hall'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { simulate, TRIAL_COUNTS } from './montyHall'
import { drawMontyHall } from './draw'

const W = 600
const H = 480

export default function MontyHallExperiment() {
  const [trials, setTrials] = useState(200)
  const [seed, setSeed] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(montyHallNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawMontyHall(canvas, trials, seed)
  }, [trials, seed])

  const swRate = simulate('switch', trials, seed)
  const stRate = simulate('stay', trials, seed + 1)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">蒙提霍尔问题</h1>
            <p className="text-gray-600">三门之谜换不换</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">累计胜率收敛曲线 · {trials} 局</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            <div className="flex gap-6 mt-3 text-sm">
              <span className="text-indigo-600 font-medium">换门胜率 {(swRate * 100).toFixed(1)}%</span>
              <span className="text-red-500 font-medium">不换胜率 {(stRate * 100).toFixed(1)}%</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">模拟局数</h3>
              <div className="space-y-2">
                {TRIAL_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setTrials(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${trials === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n} 局
                  </button>
                ))}
              </div>
              <button onClick={() => setSeed((s) => s + 1)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🎲 重新模拟
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">为什么换门更好</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 初选中奖概率只有 <b>1/3</b>，选错概率是 <b>2/3</b>。</li>
                <li>• 主持人必开一扇有羊的门，泄露了信息。</li>
                <li>• 换门等于押注"初选选错"，胜率 <b>2/3</b>。</li>
                <li>• 局数越多，两条曲线越贴近理论值。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
