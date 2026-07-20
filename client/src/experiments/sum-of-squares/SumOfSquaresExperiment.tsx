import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { sumOfSquaresNarration } from '../../narrations/scripts/sum-of-squares'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { waysToSumTwoSquares, countSumsInRange, RANGE, RANGE_CHOICES } from './sumOfSquares'
import { drawSumOfSquares } from './draw'

const W = 600
const H = 480

export default function SumOfSquaresExperiment() {
  const [range, setRange] = useState(RANGE)
  const [pick, setPick] = useState(25)
  const [mode, setMode] = useState<'grid' | 'circle'>('grid')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(sumOfSquaresNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawSumOfSquares(canvas, range, mode, pick)
  }, [range, mode, pick])

  const pairs = waysToSumTwoSquares(pick)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">平方和定理</h1>
            <p className="text-gray-600">哪些数是两平方和</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              {mode === 'grid' ? `1..${range} 中的两平方和（共 ${countSumsInRange(range)} 个）` : `格点圆 a² + b² = ${pick}`}
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">显示模式</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setMode('grid')} className={`px-3 py-2 rounded-lg text-sm font-medium ${mode === 'grid' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>数格网</button>
                <button onClick={() => setMode('circle')} className={`px-3 py-2 rounded-lg text-sm font-medium ${mode === 'circle' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>格点圆</button>
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">枚举范围 N</h3>
              <div className="grid grid-cols-3 gap-2">
                {RANGE_CHOICES.map((n) => (
                  <button key={n} onClick={() => setRange(n)} className={`px-2 py-2 rounded-lg text-sm font-medium ${range === n ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}>{n}</button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">选一个数 n = {pick}</h3>
              <input type="range" min={1} max={range} value={Math.min(pick, range)} onChange={(e) => setPick(Number(e.target.value))} className="w-full" />
              <p className="mt-2 text-sm text-gray-600">
                {pairs.length ? pairs.map((p) => `${p.a}² + ${p.b}²`).join(' = ') + ` = ${pick}` : `${pick} 不能写成两平方和`}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">费马双平方定理</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• n 是两平方和 ⟺ 每个 <b>4k+3</b> 型质因子出现<b>偶数次</b>。</li>
                <li>• 4k+1 型质数（5, 13, 17…）总能表示。</li>
                <li>• 圆 a²+b²=n 上的整点，就是所有表示方式。</li>
                <li>• 这是数论与几何相遇的经典桥梁。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
