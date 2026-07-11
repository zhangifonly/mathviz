import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { svdNarration } from '../../narrations/scripts/svd'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { svd2, conditionNumber, numericRank, MATRIX_OPTIONS } from './svd'
import { drawSvd } from './draw'

export default function SvdExperiment() {
  const [matrixId, setMatrixId] = useState('rotate-scale')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(svdNarration)
  }, [narration])

  const option = MATRIX_OPTIONS.find((o) => o.id === matrixId)!
  const matrix = option.matrix

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawSvd(canvas, matrix, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [matrix])

  const res = svd2(matrix)
  const cond = conditionNumber(res.S)
  const rank = numericRank(res.S)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">奇异值分解</h1>
            <p className="text-gray-600">任意矩阵都是旋转、拉伸、再旋转</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{option.label} · 单位圆 → 椭圆</h3>
            <canvas ref={canvasRef} width={600} height={560} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择矩阵</h3>
              <div className="space-y-2">
                {MATRIX_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setMatrixId(o.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${matrixId === o.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${matrixId === o.id ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">分解结果</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 奇异值 <b>σ1 = {res.S[0].toFixed(3)}</b>，<b>σ2 = {res.S[1].toFixed(3)}</b>。</li>
                <li>• 条件数 σ1/σ2 = <b>{cond === Infinity ? '∞' : cond.toFixed(2)}</b>，越大越病态。</li>
                <li>• 数值秩 = <b>{rank}</b>{rank < 2 ? '，矩阵退化为一维。' : '，满秩变换。'}</li>
                <li>• 单位圆经变换后是椭圆，两条<b>半轴长正是奇异值</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
