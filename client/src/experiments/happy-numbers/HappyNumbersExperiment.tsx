import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { happyNumbersNarration } from '../../narrations/scripts/happy-numbers'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { happyChain, isHappy, SAMPLES } from './happyNumbers'
import { drawHappyNumbers } from './draw'

const W = 600
const H = 480

export default function HappyNumbersExperiment() {
  const [n, setN] = useState(19)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(happyNumbersNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawHappyNumbers(canvas, n)
  }, [n])

  const happy = isHappy(n)
  const chain = happyChain(n)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">快乐数</h1>
            <p className="text-gray-600">各位平方和的迭代</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{n} 的迭代链（{chain.length} 步）</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选一个数</h3>
              <input
                type="number"
                min={1}
                value={n}
                onChange={(e) => setN(Math.max(1, Math.trunc(Number(e.target.value) || 1)))}
                className="w-full px-3 py-2 mb-3 rounded-lg border border-gray-300 text-sm"
              />
              <div className="grid grid-cols-4 gap-2">
                {SAMPLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setN(s)}
                    className={`px-2 py-2 rounded-lg text-sm font-medium ${n === s ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className={`mt-3 px-3 py-2 rounded-lg text-sm font-medium text-center ${happy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {happy ? '😊 这是快乐数' : '😔 这不是快乐数'}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">关于快乐数</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 每步把当前数换成<b>各位数字平方和</b>。</li>
                <li>• 能到达 <b>1</b> 就是快乐数，会一直停在 1。</li>
                <li>• 否则必陷入 <b>4→16→37→58→89→145→42→20</b> 循环。</li>
                <li>• 100 以内约有 20 个快乐数，分布看似随机。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
