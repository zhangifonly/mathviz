import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { gaussianCurvatureNarration } from '../../narrations/scripts/gaussian-curvature'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawCurvature } from './draw'
import { SURFACE_INFO, infoOf, type SurfaceKind } from './gaussianCurvature'

// 知识卡条目。抽成常量而不是内联 JSX, 免得组件超过 100 行
const FACTS: Array<[string, string]> = [
  ['K = κ₁·κ₂', '，两个主曲率之乘积，符号决定局部是碗形、鞍形还是柱形。'],
  ['球面 K = 1/R²', ' 处处相等，这个常数性质是球面独有的。'],
  ['高斯绝妙定理', '：K 是内蕴量，蚂蚁只靠爬行测距就能算出它。'],
  ['地图必然变形', '：K≠0 的曲面无法不失真地摊平。'],
]

const W = 640
const H = 480

export default function GaussianCurvatureExperiment() {
  const [kind, setKind] = useState<SurfaceKind>('sphere')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(gaussianCurvatureNarration)
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
      drawCurvature(canvas, { kind, showReadout: true, yaw: 0.6 + el * 0.26 })
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
            <h1 className="text-2xl font-bold text-gray-800">高斯曲率</h1>
            <p className="text-gray-600">把弯曲程度铺在曲面上</p>
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
                {SURFACE_INFO.map((q) => (
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
                <li>• 曲率特征 <b>{String(info.sign)}</b></li>
                <li>• 局部形状 <b>{String(info.note)}</b></li>
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
