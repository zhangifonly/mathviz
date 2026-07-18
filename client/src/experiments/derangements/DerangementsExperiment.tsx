import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { derangementsNarration } from '../../narrations/scripts/derangements'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { derangement, factorial, derangementRatio, N_VALUES } from './derangements'
import { drawDerangements } from './draw'

const W = 600
const H = 480

export default function DerangementsExperiment() {
  const [n, setN] = useState(6)
  const [mode, setMode] = useState<'ratio' | 'grid'>('grid')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(derangementsNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawDerangements(canvas, mode, n)
  }, [n, mode])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">错排问题</h1>
            <p className="text-gray-600">无一在原位的排列</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              {mode === 'grid' ? `n = ${n} · 错排列举（D=${derangement(n)}）` : 'D(n)/n! 趋于 1/e'}
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">视图</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setMode('grid')} className={`px-3 py-2 rounded-lg text-sm font-medium ${mode === 'grid' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>错排列举</button>
                <button onClick={() => setMode('ratio')} className={`px-3 py-2 rounded-lg text-sm font-medium ${mode === 'ratio' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>比值曲线</button>
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">元素个数 n</h3>
              <div className="space-y-2">
                {N_VALUES.map((v) => (
                  <button
                    key={v}
                    onClick={() => setN(v)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${n === v ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                  >
                    n = {v}（D={derangement(v)}，D/n!={derangementRatio(v).toFixed(4)}）
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 错排：每个元素都<b>不在</b>原位置。</li>
                <li>• 递推 <b>D(n)=(n-1)(D(n-1)+D(n-2))</b>，D(0)=1,D(1)=0。</li>
                <li>• 序列 1,0,1,2,9,44,265,1854…</li>
                <li>• 比值 D(n)/n! 快速趋于 <b>1/e≈0.368</b>。</li>
                <li>• n={n} 时全排列 {factorial(n)} 种，错排 {derangement(n)} 种。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
