import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { monkeySaddleNarration } from '../../narrations/scripts/monkey-saddle'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawMonkeySaddle } from './draw'
import { hessianDet, signChanges, PRESETS } from './monkeySaddle'

// 知识卡条目。抽成常量而不是内联 JSX, 免得组件超过 100 行
const FACTS: Array<[string, string]> = [
  ['三上三下', '：普通鞍面只够放两条腿，这张面还能搁下猴子的尾巴。'],
  ['极坐标 z = r³cos3θ', '，转 120° 复原，转 60° 上下颠倒。'],
  ['Re((x+iy)ⁿ)', ' 给出 n 重鞍面；只有 n=2 时二阶判别法仍有效。'],
]

const W = 640
const H = 480

export default function MonkeySaddleExperiment() {
  const [order, setOrder] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(monkeySaddleNarration)
  }, [narration])

  // 用 Canvas 而非 Plotly: 要叠加坡向标记与 Hesse 读数
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const el = (ts - start) / 1000
      drawMonkeySaddle(canvas, {
        order, showSlopes: true, showHessian: true, yaw: 0.6 + el * 0.26,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [order])

  const det = hessianDet(0, 0, order)
  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">猴鞍面</h1>
            <p className="text-gray-600">三上三下的退化临界点</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">n = {order} · 红为上坡，蓝为下坡</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">鞍面重数 n：{order}</h3>
              <input
                type="range" min={2} max={5} step={1} value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full" aria-label="鞍面重数"
              />
              <div className="mt-3 space-y-2">
                {PRESETS.map((s) => (
                  <button key={s.label} onClick={() => setOrder(s.order)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between ${order === s.order ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    <span>{s.label}</span><span className="text-xs opacity-70">{s.note}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">实时验证与要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 原点 Hesse 行列式 <b>{det.toFixed(3)}</b>（{Math.abs(det) < 1e-6 ? '判别法失效' : '判别法有效'}）</li>
                <li>• 沿单位圆符号变化 <b>{signChanges(order)}</b> 次（即 2n）</li>
                {FACTS.map(([h, t]) => <li key={h}>• <b>{h}</b>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
