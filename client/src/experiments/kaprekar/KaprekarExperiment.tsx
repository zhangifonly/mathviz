import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { kaprekarNarration } from '../../narrations/scripts/kaprekar'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLES, stepsToKaprekar } from './kaprekar'
import { drawKaprekar } from './draw'

const W = 600
const H = 480

export default function KaprekarExperiment() {
  const [n, setN] = useState(3524)
  const [input, setInput] = useState('3524')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(kaprekarNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawKaprekar(canvas, n, 7)
  }, [n])

  const steps = stepsToKaprekar(n)
  const apply = () => {
    const v = parseInt(input, 10)
    if (v >= 1000 && v <= 9999) setN(v)
  }

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">卡普雷卡常数</h1>
            <p className="text-gray-600">神奇的6174</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">从 {n} 出发的迭代链</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">输入四位数</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={input}
                  min={1000}
                  max={9999}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') apply() }}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
                <button onClick={apply} className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600">
                  计算
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {steps > 0 ? `收敛用了 ${steps} 步` : '数字全相同，不收敛（落入 0）'}
              </p>
              <div className="mt-3 space-y-2">
                {SAMPLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setN(s); setInput(String(s)) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${n === s ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    示例 {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 6174 由印度数学家<b>卡普雷卡</b>于 1949 年发现。</li>
                <li>• 除数字全相同的数外，其余四位数<b>最多 7 步</b>收敛。</li>
                <li>• 6174 是<b>不动点</b>：7641 − 1467 = 6174。</li>
                <li>• 三位数也有类似常数 <b>495</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
