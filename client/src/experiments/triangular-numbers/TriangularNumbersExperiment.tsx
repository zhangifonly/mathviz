import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { triangularNumbersNarration } from '../../narrations/scripts/triangular-numbers'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { TYPES, figurate, type FigurateType } from './triangularNumbers'
import { drawTriangularNumbers } from './draw'

const W = 600
const H = 480
const LABELS: Record<FigurateType, string> = {
  triangular: '三角形数',
  square: '正方形数',
  pentagonal: '五边形数',
}

export default function TriangularNumbersExperiment() {
  const [type, setType] = useState<FigurateType>('triangular')
  const [n, setN] = useState(5)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(triangularNumbersNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawTriangularNumbers(canvas, type, n)
  }, [type, n])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">三角形数与图形数</h1>
            <p className="text-gray-600">点子摆成图形</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{LABELS[type]} · 第 {n} 个 = {figurate(type, n)}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">图形类型</h3>
              <div className="space-y-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${type === t ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {LABELS[t]}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">第 n 个 (n = {n})</h3>
              <input
                type="range" min={1} max={9} value={n}
                onChange={(e) => setN(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">公式与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 三角形数 <b>T(n)=n(n+1)/2</b>，就是 1+2+…+n。</li>
                <li>• 正方形数 <b>n²</b>，五边形数 <b>n(3n-1)/2</b>。</li>
                <li>• 相邻两个三角形数相加，恰好是一个<b>完全平方数</b>。</li>
                <li>• 高斯少年时用配对法秒算 1 到 100 之和，正是它。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
