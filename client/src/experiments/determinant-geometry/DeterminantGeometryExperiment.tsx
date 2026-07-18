import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { determinantGeometryNarration } from '../../narrations/scripts/determinant-geometry'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { det2, SAMPLE_MATRICES, type Matrix2 } from './determinantGeometry'
import { drawDeterminantGeometry } from './draw'

const W = 600
const H = 480

export default function DeterminantGeometryExperiment() {
  const [matrix, setMatrix] = useState<Matrix2>([[2, 0], [0, 1.5]])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(determinantGeometryNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawDeterminantGeometry(canvas, matrix, true)
  }, [matrix])

  const d = det2(matrix)
  const setEntry = (r: number, c: number, v: number) => {
    setMatrix((m) => {
      const next: Matrix2 = [[m[0][0], m[0][1]], [m[1][0], m[1][1]]]
      next[r][c] = v
      return next
    })
  }
  const labels = [['a', 'b'], ['c', 'd']]

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">行列式的几何意义</h1>
            <p className="text-gray-600">面积与体积的缩放</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">单位正方形 → 平行四边形 · det = {d.toFixed(2)}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">调整矩阵元素</h3>
              <div className="grid grid-cols-2 gap-3">
                {[0, 1].map((r) => [0, 1].map((c) => (
                  <label key={`${r}${c}`} className="text-sm text-gray-600">
                    <span className="font-mono">{labels[r][c]} = {matrix[r][c].toFixed(1)}</span>
                    <input type="range" min={-3} max={3} step={0.1} value={matrix[r][c]}
                      onChange={(e) => setEntry(r, c, Number(e.target.value))}
                      className="w-full accent-indigo-500" />
                  </label>
                )))}
              </div>
              <p className="mt-3 text-sm text-gray-500">{d === 0 ? '行列式为 0：平行四边形被压成线段，空间降维。' : d < 0 ? '行列式为负：定向被翻转（镜像）。' : '面积缩放因子 = |det|。'}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">预置矩阵</h3>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_MATRICES.map((s) => (
                  <button key={s.name} onClick={() => setMatrix(s.matrix)}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
