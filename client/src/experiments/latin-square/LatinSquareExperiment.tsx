import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { latinSquareNarration } from '../../narrations/scripts/latin-square'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { generateLatinSquare, isValidLatinSquare, ORDERS } from './latinSquare'
import { drawLatinSquare } from './draw'

const W = 600
const H = 480

export default function LatinSquareExperiment() {
  const [n, setN] = useState(5)
  const [shift, setShift] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(latinSquareNarration)
  }, [narration])

  const grid = generateLatinSquare(n, shift)
  const valid = isValidLatinSquare(grid)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawLatinSquare(canvas, generateLatinSquare(n, shift), -1)
  }, [n, shift])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">拉丁方</h1>
            <p className="text-gray-600">每行每列各符号一次</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{n} 阶拉丁方 · {valid ? '校验通过' : '非拉丁方'}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择阶数 n</h3>
              <div className="space-y-2">
                {ORDERS.map((k) => (
                  <button
                    key={k}
                    onClick={() => setN(k)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${n === k ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {k} 阶（{k}×{k}）
                  </button>
                ))}
              </div>
              <button onClick={() => setShift((s) => (s % (n - 1)) + 1)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🔁 换一种循环移位
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">应用与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 数独就是带宫格约束的 <b>9 阶拉丁方</b>。</li>
                <li>• 循环移位法：格 (i,j) 填 <b>(i·s+j) mod n</b>。</li>
                <li>• 两个方叠加后 n² 对全不同，即 <b>正交拉丁方</b>。</li>
                <li>• 农业<b>实验设计</b>用它均衡消除行列干扰。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
