import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { eigenVisualizationNarration } from '../../narrations/scripts/eigen-visualization'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { eigen2x2, MATRIX_OPTIONS } from './eigenVisualization'
import { drawEigenVisualization } from './draw'

export default function EigenVisualizationExperiment() {
  const [optId, setOptId] = useState(MATRIX_OPTIONS[0].id)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(eigenVisualizationNarration)
  }, [narration])

  const option = MATRIX_OPTIONS.find((o) => o.id === optId)!

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.015)
      drawEigenVisualization(canvas, option.matrix, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [option])

  const result = eigen2x2(option.matrix)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">特征值与特征向量</h1>
            <p className="text-gray-600">在矩阵变换下方向不变的特殊向量</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{option.label} · 蓝色向量随变换转向，彩色为特征向量</h3>
            <canvas ref={canvasRef} width={600} height={560} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择矩阵</h3>
              <div className="space-y-2">
                {MATRIX_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setOptId(o.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${optId === o.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${optId === o.id ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">特征值</h3>
              {result.real ? (
                <ul className="text-sm text-gray-600 space-y-1.5">
                  {result.pairs.map((p, i) => (
                    <li key={i}>
                      • λ<sub>{i + 1}</sub> = <b>{p.value.toFixed(3)}</b>，方向 ({p.vector[0].toFixed(2)}, {p.vector[1].toFixed(2)})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">判别式为负，特征值是复数，平面内没有方向保持不变的实特征向量。</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
