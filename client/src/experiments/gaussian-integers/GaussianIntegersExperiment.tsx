import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { gaussianIntegersNarration } from '../../narrations/scripts/gaussian-integers'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { RANGE, gaussianPrimes } from './gaussianIntegers'
import { drawGaussianIntegers } from './draw'

const W = 600
const H = 480

export default function GaussianIntegersExperiment() {
  const [range, setRange] = useState(10)
  const [primesOnly, setPrimesOnly] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(gaussianIntegersNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawGaussianIntegers(canvas, range, primesOnly)
  }, [range, primesOnly])

  const primeCount = gaussianPrimes(range).length

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">高斯整数</h1>
            <p className="text-gray-600">复平面上的整数</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">半径 {range} · 高斯素数 {primeCount} 个</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">缩放范围</h3>
              <div className="space-y-2">
                {RANGE.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${range === r ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    半径 {r}
                  </button>
                ))}
              </div>
              <button onClick={() => setPrimesOnly((v) => !v)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-pink-100 text-pink-700 hover:bg-pink-200">
                {primesOnly ? '显示全部格点' : '只看高斯素数'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 高斯整数 <b>a+bi</b> 排成复平面上的方格点阵。</li>
                <li>• 范数 <b>N(z)=a²+b²</b>，等于到原点距离的平方。</li>
                <li>• 高斯素数呈现<b>四重与八重对称</b>的花瓣分布。</li>
                <li>• 素数 2、4k+1 会<b>分裂</b>，4k+3 仍保持素性。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
