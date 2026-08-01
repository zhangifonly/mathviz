import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { tubeSurfaceNarration } from '../../narrations/scripts/tube-surface'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawTube } from './draw'
import { CURVE_INFO, infoOf, type CurveKind } from './tubeSurface'

// 知识卡条目。抽成常量而不是内联 JSX, 免得组件超过 100 行
const FACTS: Array<[string, string]> = [
  ['截面必须垂直于曲线', '，且相邻截面不能突然扭转，否则管子会自己拧起来。'],
  ['Frenet 标架 T/N/B', ' 两两垂直，随曲线一路移动，绿红蓝三根轴即是。'],
  ['曲率为零处失效', '：主法向量的分母归零，直线段需改用 Bishop 标架。'],
  ['半径精确恒定', '：管面上每点到中心线的距离误差 <1e-10。'],
]

const W = 640
const H = 480

export default function TubeSurfaceExperiment() {
  const [kind, setKind] = useState<CurveKind>('helix')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(tubeSurfaceNarration)
  }, [narration])

  // 用 Canvas 而非 Plotly: 每种类型参数域不同, 还要叠加高亮元素
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const el = (ts - start) / 1000
      drawTube(canvas, { kind, showCenter: true, showFrame: true, surfaceAlpha: 0.6, yaw: 0.6 + el * 0.26 })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [kind])

  const info = infoOf(kind)
  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">管状曲面</h1>
            <p className="text-gray-600">沿曲线套一根圆管</p>
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
              <h3 className="text-lg font-semibold mb-3">选择类型</h3>
              <div className="space-y-2">
                {CURVE_INFO.map((q) => (
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
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">当前类型与要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 中心线 <b>{String(info.equation)}</b></li>
                <li>• 特点 <b>{String(info.note)}</b></li>
                {FACTS.map(([head, tail]) => (
                  <li key={head}>• <b>{head}</b>{tail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
