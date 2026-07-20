import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { frobeniusCoinNarration } from '../../narrations/scripts/frobenius-coin'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { COIN_SETS, frobeniusNumber } from './frobeniusCoin'
import { drawFrobeniusCoin } from './draw'

const W = 600
const H = 480

export default function FrobeniusCoinExperiment() {
  const [idx, setIdx] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(frobeniusCoinNarration)
  }, [narration])

  const coins = COIN_SETS[idx]
  const frob = frobeniusNumber(coins)
  const maxAmount = Math.max(48, frob + 8)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawFrobeniusCoin(canvas, coins, maxAmount)
  }, [coins, maxAmount])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Frobenius硬币问题</h1>
            <p className="text-gray-600">无法凑出的最大金额</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">面额 {coins.join(', ')} · 绿=可凑 红=不可凑</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">硬币面额组合</h3>
              <div className="space-y-2">
                {COIN_SETS.map((set, i) => (
                  <button
                    key={set.join('-')}
                    onClick={() => setIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    面额 {set.join(', ')}
                  </button>
                ))}
              </div>
              <div className="mt-3 px-3 py-2 rounded-lg bg-yellow-50 text-yellow-800 text-sm font-medium">
                Frobenius 数 = <b>{frob}</b>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">背后的数学</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 面额<b>互质</b>才有有限的最大不可凑金额。</li>
                <li>• 两枚硬币 a,b：答案 = <b>ab − a − b</b>。</li>
                <li>• 多枚硬币无闭式，用<b>完全背包 DP</b> 求解。</li>
                <li>• 麦乐鸡数 (6,9,20) 的答案是著名的 <b>43</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
