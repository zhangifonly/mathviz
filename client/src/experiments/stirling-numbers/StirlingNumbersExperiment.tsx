import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { stirlingNumbersNarration } from '../../narrations/scripts/stirling-numbers'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { stirling2, stirling1, MAX_N } from './stirlingNumbers'
import { drawStirlingNumbers } from './draw'

const W = 600
const H = 480

export default function StirlingNumbersExperiment() {
  const [kind, setKind] = useState<'first' | 'second'>('second')
  const [n, setN] = useState(5)
  const [k, setK] = useState(2)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(stirlingNumbersNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawStirlingNumbers(canvas, MAX_N, kind, [n, Math.min(k, n)])
  }, [kind, n, k])

  const kk = Math.min(k, n)
  const value = kind === 'first' ? stirling1(n, kk) : stirling2(n, kk)
  const label = kind === 'first' ? '循环圆圈' : '非空子集'

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">斯特林数</h1>
            <p className="text-gray-600">划分与循环的计数</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{kind === 'first' ? '第一类' : '第二类'}斯特林三角 · 高亮 ({n},{kk})</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">类型</h3>
              <div className="flex gap-2">
                {(['second', 'first'] as const).map((t) => (
                  <button key={t} onClick={() => setKind(t)} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${kind === t ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    {t === 'second' ? '第二类·划分' : '第一类·循环'}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">选择格子 (n, k)</h3>
              <label className="text-sm text-gray-600">n = {n}</label>
              <input type="range" min={1} max={MAX_N} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-full" />
              <label className="text-sm text-gray-600">k = {kk}</label>
              <input type="range" min={1} max={n} value={kk} onChange={(e) => setK(Number(e.target.value))} className="w-full" />
              <div className="mt-3 p-3 rounded-lg bg-amber-50 text-amber-800 text-sm">
                {kind === 'first' ? 'c' : 'S'}({n},{kk}) = <b className="text-lg">{value}</b>
                <span className="block text-xs mt-1">把 {n} 个元素分成 {kk} 个{label}的方案数</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">知识卡</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 第二类递推：<b>S(n,k)=k·S(n-1,k)+S(n-1,k-1)</b>。</li>
                <li>• 第一类（无符号）递推系数是 <b>n-1</b>，数的是循环排列。</li>
                <li>• 第二类每行之和是<b>贝尔数</b>，第一类每行之和是 <b>n!</b>。</li>
                <li>• 颜色越深代表数值越大，直观看出三角的爆炸增长。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
