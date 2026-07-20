import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { eulerLineNarration } from '../../narrations/scripts/euler-line'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { PRESET_TRIANGLES, centroid, circumcenter, orthocenter, collinear, dist } from './eulerLine'
import { drawEulerLine } from './draw'

const W = 600
const H = 480
const NAMES = ['不规则三角形', '钝角三角形', '直角三角形']

export default function EulerLineExperiment() {
  const [preset, setPreset] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(eulerLineNarration)
  }, [narration])

  const tri = PRESET_TRIANGLES[preset]
  const G = centroid(tri.A, tri.B, tri.C)
  const O = circumcenter(tri.A, tri.B, tri.C)
  const Hp = orthocenter(tri.A, tri.B, tri.C)
  const isLine = collinear(O, G, Hp, 1e-3)
  const ratio = dist(G, Hp) / (dist(O, G) || 1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawEulerLine(canvas, tri.A, tri.B, tri.C, true)
  }, [tri])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">欧拉线</h1>
            <p className="text-gray-600">三心共线的奇迹</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{NAMES[preset]} · 外心 O / 重心 G / 垂心 H</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">切换三角形</h3>
              <div className="space-y-2">
                {NAMES.map((name, i) => (
                  <button
                    key={name}
                    onClick={() => setPreset(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${preset === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">实时验证</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 三心共线：<b className={isLine ? 'text-emerald-600' : 'text-red-600'}>{isLine ? '成立' : '否'}</b></li>
                <li>• GH / OG 比值：<b>{ratio.toFixed(3)}</b>（理论 2.000）</li>
                <li>• 重心是三顶点坐标的<b>平均</b>。</li>
                <li>• 外心到三顶点<b>等距</b>，是外接圆圆心。</li>
                <li>• 垂心是三条<b>高线</b>的交点。</li>
                <li>• 等边三角形时三心<b>重合</b>，欧拉线退化。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
