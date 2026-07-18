import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { ninePointCircleNarration } from '../../narrations/scripts/nine-point-circle'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { PRESET_TRIANGLES, type Pt } from './ninePointCircle'
import { drawNinePointCircle, type Highlight } from './draw'

const W = 600
const H = 480

const HL: { key: Highlight; label: string }[] = [
  { key: 'all', label: '全部九点' },
  { key: 'mid', label: '三边中点' },
  { key: 'foot', label: '三高垂足' },
  { key: 'ortho', label: '垂心连线中点' },
]

// 预设三角形按 640x540 布局，此处等比缩放到 600x480
function scaled(i: number): [Pt, Pt, Pt] {
  const s = (p: Pt): Pt => ({ x: (p.x * W) / 640, y: (p.y * H) / 540 })
  return PRESET_TRIANGLES[i].map(s) as [Pt, Pt, Pt]
}

export default function NinePointCircleExperiment() {
  const [tri, setTri] = useState(0)
  const [highlight, setHighlight] = useState<Highlight>('all')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(ninePointCircleNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawNinePointCircle(canvas, scaled(tri), highlight)
  }, [tri, highlight])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">九点圆</h1>
            <p className="text-gray-600">九个特殊点共圆</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">三角形与它的九点圆</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">高亮点类别</h3>
              <div className="space-y-2">
                {HL.map((h) => (
                  <button key={h.key} onClick={() => setHighlight(h.key)} className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${highlight === h.key ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    {h.label}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mb-3 mt-4">切换三角形</h3>
              <div className="flex gap-2">
                {PRESET_TRIANGLES.map((_, i) => (
                  <button key={i} onClick={() => setTri(i)} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${tri === i ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">关于九点圆</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 九个点：三边<b>中点</b>、三高<b>垂足</b>、垂心到三顶点连线的中点。</li>
                <li>• 这九个点始终落在<b>同一个圆</b>上。</li>
                <li>• 圆心是<b>外心与垂心</b>的中点。</li>
                <li>• 半径恰为<b>外接圆半径的一半</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
