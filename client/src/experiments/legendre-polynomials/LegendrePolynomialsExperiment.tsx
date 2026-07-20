import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { legendrePolynomialsNarration } from '../../narrations/scripts/legendre-polynomials'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { DEGREES } from './legendrePolynomials'
import { drawLegendrePolynomials, drawOrthogonalityMatrix } from './draw'

const W = 600
const H = 480

export default function LegendrePolynomialsExperiment() {
  const [maxN, setMaxN] = useState(4)
  const curveRef = useRef<HTMLCanvasElement>(null)
  const matrixRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(legendrePolynomialsNarration)
  }, [narration])

  useEffect(() => {
    if (curveRef.current) drawLegendrePolynomials(curveRef.current, maxN)
    const degs = []
    for (let i = 0; i <= maxN; i++) degs.push(i)
    if (matrixRef.current) drawOrthogonalityMatrix(matrixRef.current, degs)
  }, [maxN])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">勒让德多项式</h1>
            <p className="text-gray-600">区间上的正交基</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">P0..P{maxN} 曲线 · 区间 [-1,1]</h3>
            <canvas ref={curveRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">最高阶数</h3>
              <div className="space-y-2">
                {DEGREES.map((n) => (
                  <button
                    key={n}
                    onClick={() => setMaxN(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${maxN === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    显示到 P{n}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">正交性矩阵</h3>
              <canvas ref={matrixRef} width={260} height={260} className="w-full rounded-lg bg-slate-50" />
              <p className="text-xs text-gray-500 mt-2">对角格 = 各阶模长平方，非对角 ≈ 0，印证正交。</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">应用与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• Bonnet 递推：(n+1)P<sub>n+1</sub>=(2n+1)xP<sub>n</sub>-nP<sub>n-1</sub>。</li>
                <li>• 在 [-1,1] 上关于权重 1 <b>两两正交</b>。</li>
                <li>• 高斯-勒让德求积用它的<b>零点</b>作节点。</li>
                <li>• 球谐函数、静电多极展开都以它为基。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
