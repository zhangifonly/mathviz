import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { lineClippingNarration } from '../../narrations/scripts/line-clipping'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { WINDOW, SEGMENTS, clipLine, type Segment } from './lineClipping'
import { drawLineClipping } from './draw'

const W = 600
const H = 480

export default function LineClippingExperiment() {
  const [showOutside, setShowOutside] = useState(true)
  const [drag, setDrag] = useState<Segment>({ x1: 90, y1: 320, x2: 520, y2: 140 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(lineClippingNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawLineClipping(canvas, WINDOW, [...SEGMENTS, drag], showOutside)
  }, [showOutside, drag])

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W
    const y = ((e.clientY - rect.top) / rect.height) * H
    // 每次点击移动可拖动线段的第二个端点
    setDrag((d) => ({ ...d, x2: x, y2: y }))
  }

  const clippedDrag = clipLine(drag, WINDOW)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">线段裁剪</h1>
            <p className="text-gray-600">Cohen-Sutherland 算法</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">矩形窗口裁剪 · 点击画布移动测试线段</h3>
            <canvas ref={canvasRef} width={W} height={H} onClick={onCanvasClick} className="w-full rounded-lg bg-slate-50 cursor-crosshair" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">显示选项</h3>
              <button
                onClick={() => setShowOutside((v) => !v)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium ${showOutside ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
              >
                {showOutside ? '隐藏窗外部分' : '显示窗外部分'}
              </button>
              <p className="text-sm text-gray-600 mt-3">
                测试线段裁剪结果：{clippedDrag ? '有可见部分（粉色）' : '整段在窗外，被拒绝'}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">算法要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 每个端点算 <b>4 位区域码</b>（上下左右）。</li>
                <li>• 两码都为 0：整段在内，<b>直接接受</b>。</li>
                <li>• 两码按位与非 0：同侧窗外，<b>直接拒绝</b>。</li>
                <li>• 否则求线段与窗口边的交点，<b>迭代收窄</b>。</li>
                <li>• 广泛用于 2D 图形渲染的视口裁剪。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
