import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { quadricSurfacesNarration } from '../../narrations/scripts/quadric-surfaces'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawQuadric } from './draw'
import { QUADRIC_INFO, infoOf, signature, type QuadricKind } from './quadricSurfaces'

const W = 640
const H = 480

export default function QuadricSurfacesExperiment() {
  const [kind, setKind] = useState<QuadricKind>('ellipsoid')
  const [a, setA] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(quadricSurfacesNarration)
  }, [narration])

  // 用 Canvas 而非 Plotly: 双叶双曲面要画两片, 且需按 kind 换参数域
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const el = (ts - start) / 1000
      drawQuadric(canvas, { kind, a, b: 1, c: 1, yaw: 0.6 + el * 0.26 })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [kind, a])

  const info = infoOf(kind)
  const sig = signature(kind)
  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">二次曲面分类</h1>
            <p className="text-gray-600">三元二次方程的六张面孔</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.label} · 自动旋转</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择曲面</h3>
              <div className="space-y-2">
                {QUADRIC_INFO.map((q) => (
                  <button
                    key={q.kind}
                    onClick={() => setKind(q.kind)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between items-center ${kind === q.kind ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <span>{q.label}</span>
                    <span className={`text-xs ${kind === q.kind ? 'text-indigo-100' : 'text-indigo-400'}`}>{q.note}</span>
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mb-2 mt-4">半轴 a：{a.toFixed(2)}</h3>
              <input
                type="range" min={0.5} max={1.8} step={0.02} value={a}
                onChange={(e) => setA(Number(e.target.value))}
                className="w-full" aria-label="半轴 a"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">分类依据</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 标准形 <b>{info.equation}</b></li>
                <li>• 平方项符号 <b>[{sig.join(', ')}]</b>（决定类型，系数大小只改胖瘦）</li>
                <li>• {info.ruled ? '是' : '不是'}<b>直纹面</b>，连通分支 <b>{info.pieces}</b> 个</li>
                <li>• 非退化实二次曲面<b>只有六类</b>，无穷多方程归结为有限几种</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
