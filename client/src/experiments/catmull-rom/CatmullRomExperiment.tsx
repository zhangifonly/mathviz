import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { catmullRomNarration } from '../../narrations/scripts/catmull-rom'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { CONTROL_POINTS, SEGMENT_SAMPLES, type Point } from './catmullRom'
import { drawCatmullRom } from './draw'

const W = 600
const H = 480

export default function CatmullRomExperiment() {
  const [points, setPoints] = useState<Point[]>(() => CONTROL_POINTS.map((p) => ({ ...p })))
  const [samples, setSamples] = useState(16)
  const [showBSpline, setShowBSpline] = useState(true)
  const [drag, setDrag] = useState(-1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(catmullRomNarration)
  }, [narration])

  useEffect(() => {
    if (canvasRef.current) drawCatmullRom(canvasRef.current, points, samples, showBSpline, drag)
  }, [points, samples, showBSpline, drag])

  const toLocal = (e: React.MouseEvent) => {
    const r = canvasRef.current!.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }
  }
  const onDown = (e: React.MouseEvent) => {
    const m = toLocal(e)
    let best = -1, bd = 15 * 15
    points.forEach((p, i) => {
      const d = (p.x - m.x) ** 2 + (p.y - m.y) ** 2
      if (d < bd) { bd = d; best = i }
    })
    setDrag(best)
  }
  const onMove = (e: React.MouseEvent) => {
    if (drag < 0) return
    const m = toLocal(e)
    setPoints((ps) => ps.map((p, i) => (i === drag ? m : p)))
  }

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Catmull-Rom样条</h1>
            <p className="text-gray-600">过控制点的插值曲线</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">拖动黑点 · 曲线始终穿过它们</h3>
            <canvas ref={canvasRef} width={W} height={H} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={() => setDrag(-1)} onMouseLeave={() => setDrag(-1)} className="w-full rounded-lg bg-slate-50 cursor-pointer" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">每段采样数</h3>
              <div className="space-y-2">
                {SEGMENT_SAMPLES.map((n) => (
                  <button key={n} onClick={() => setSamples(n)} className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${samples === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    {n} 段采样
                  </button>
                ))}
              </div>
              <button onClick={() => setShowBSpline((v) => !v)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-orange-100 text-orange-700 hover:bg-orange-200">
                {showBSpline ? '隐藏' : '显示'} B 样条对比
              </button>
              <button onClick={() => setPoints(CONTROL_POINTS.map((p) => ({ ...p })))} className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                ↺ 重置控制点
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">对比与应用</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• <b className="text-indigo-600">靛蓝</b>=Catmull-Rom，<b>穿过</b>每个点（插值）。</li>
                <li>• <b className="text-orange-500">橙色</b>=B 样条，被点<b>拉扯</b>但不过点（逼近）。</li>
                <li>• 切线由相邻两点估计：(P<sub>i+1</sub>−P<sub>i−1</sub>)/2。</li>
                <li>• 广泛用于动画路径、相机运镜与轨迹平滑。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
