import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { diceProbabilityNarration } from '../../narrations/scripts/dice-probability'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { DICE_COUNTS } from './diceProbability'
import { drawDiceProbability } from './draw'

const W = 600
const H = 480
const TRIAL_STEPS = [0, 100, 1000, 10000, 100000]

export default function DiceProbabilityExperiment() {
  const [numDice, setNumDice] = useState(2)
  const [trials, setTrials] = useState(1000)
  const [seed, setSeed] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(diceProbabilityNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawDiceProbability(canvas, numDice, trials, seed)
  }, [numDice, trials, seed])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">骰子与古典概率</h1>
            <p className="text-gray-600">频率逼近概率</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{numDice} 个骰子 · {trials.toLocaleString()} 次投掷</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">骰子数量</h3>
              <div className="space-y-2">
                {DICE_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNumDice(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${numDice === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n} 个骰子
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">投掷次数</h3>
              <div className="grid grid-cols-2 gap-2">
                {TRIAL_STEPS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTrials(t)}
                    className={`px-2 py-2 rounded-lg text-xs font-medium ${trials === t ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'}`}
                  >
                    {t === 0 ? '仅理论' : t.toLocaleString()}
                  </button>
                ))}
              </div>
              <button onClick={() => setSeed((s) => s + 1)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🎲 重新模拟
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 古典概率 = <b>有利结果数</b> ÷ 等可能结果总数。</li>
                <li>• 两骰子和为 <b>7</b> 的组合最多，概率 6/36。</li>
                <li>• 投掷越多，橙色<b>频率</b>越贴合蓝色理论柱。</li>
                <li>• 这就是<b>大数定律</b>：频率稳定于概率。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
