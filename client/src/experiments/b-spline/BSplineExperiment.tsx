import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { bSplineNarration } from '../../narrations/scripts/b-spline'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { CONTROL_POINTS, DEGREE, type Point } from './bSpline'
import { drawBSpline } from './draw'

const W = 600
const H = 480

export default function BSplineExperiment() {
  const [points, setPoints] = useState<Point[]>(CONTROL_POINTS.map((p) => ({ ...p })))
  const [drag, setDrag] = useState(-1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(bSplineNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) drawBSpline(canvas, points, DEGREE, drag, true)
  }, [points, drag])

  const toLocal = (e: React.MouseEvent) => {
    const r = canvasRef.current!.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }
  }
  const onDown = (e: React.MouseEvent) => {
    const m = toLocal(e)
    let best = -1
    let bd = 200
    points.forEach((p, i) => {
      const d = (p.x - m.x) ** 2 + (p.y - m.y) ** 2
      if (d < bd) { bd = d; best = i }
    })
    setDrag(best)
  }
  const onMove = (e: React.MouseEvent) => {
    if (drag < 0) return
    const m = toLocal(e)
    setPoints((ps) => ps.map((p, i) => (i === drag ? { x: m.x, y: Math.min(m.y, H * 0.68) } : p)))
  }
  const reset = () => { setPoints(CONTROL_POINTS.map((p) => ({ ...p }))); setDrag(-1) }

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">B样条曲线</h1>
            <p className="text-gray-600">控制点与基函数</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">三次 B 样条 · 拖动控制点</h3>
            <canvas
              ref={canvasRef} width={W} height={H}
              onMouseDown={onDown} onMouseMove={onMove}
              onMouseUp={() => setDrag(-1)} onMouseLeave={() => setDrag(-1)}
              className="w-full rounded-lg bg-slate-50 cursor-pointer"
            />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">操作</h3>
              <p className="text-sm text-gray-600 mb-3">直接用鼠标拖动画布上的控制点 P0–P5，观察曲线如何随之变形。下方彩色曲线是各控制点的基函数。</p>
              <button onClick={reset} className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">↺ 恢复初始控制点</button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 曲线<b>不经过</b>控制点，被它们共同拉扯出光滑形状。</li>
                <li>• 三次样条每点只受相邻 <b>4</b> 个控制点影响。</li>
                <li>• <b>局部支撑</b>：拖一个点只改变附近曲线，远处不动。</li>
                <li>• 基函数处处非负、逐点求和恒为 1（单位分解）。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
