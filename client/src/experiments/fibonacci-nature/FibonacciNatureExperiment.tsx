import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { fibonacciNatureNarration } from '../../narrations/scripts/fibonacci-nature'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { fibonacci, ANGLES } from './fibonacciNature'
import { drawFibonacciNature } from './draw'

const W = 600
const H = 480
const COUNT = 800

export default function FibonacciNatureExperiment() {
  const [angle, setAngle] = useState(137.5)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(fibonacciNatureNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawFibonacciNature(canvas, COUNT, angle)
  }, [angle])

  const fib = fibonacci(11).slice(1)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">斐波那契与自然</h1>
            <p className="text-gray-600">黄金角与向日葵</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{COUNT} 颗种子 · 发散角 {angle}°</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-900" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">发散角</h3>
              <div className="space-y-2">
                {ANGLES.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAngle(a)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${angle === a ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {a}°{a === 137.5 ? ' (黄金角)' : ''}
                  </button>
                ))}
              </div>
              <label className="block mt-3 text-sm text-gray-600">微调 {angle.toFixed(1)}°</label>
              <input type="range" min={90} max={150} step={0.1} value={angle} onChange={(e) => setAngle(parseFloat(e.target.value))} className="w-full" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">斐波那契数列</h3>
              <p className="text-sm text-gray-700 font-mono">{fib.join(', ')} ...</p>
              <ul className="text-sm text-gray-600 space-y-1.5 mt-2">
                <li>• 每项 = 前两项<b>之和</b>。</li>
                <li>• 相邻项之比趋近<b>黄金比</b> 1.618。</li>
                <li>• 黄金角约 <b>137.5°</b>，向日葵按它排种子。</li>
                <li>• 只差零点几度，螺旋就<b>散乱</b>了。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
