import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { pointInPolygonNarration } from '../../narrations/scripts/point-in-polygon'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { POLYGONS, POLYGON_KEYS } from './pointInPolygon'
import { drawPointInPolygon, type Rule } from './draw'

const W = 600
const H = 480

const RULE_LABEL: Record<Rule, string> = { ray: '射线法（偶奇）', winding: '环绕数（非零）' }
const POLY_LABEL: Record<string, string> = { convex: '凸六边形', concave: '凹箭头形', star: '自交五角星' }

export default function PointInPolygonExperiment() {
  const [polyKey, setPolyKey] = useState<string>('star')
  const [rule, setRule] = useState<Rule>('ray')
  const [probe, setProbe] = useState<{ x: number; y: number } | null>({ x: 300, y: 250 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(pointInPolygonNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPointInPolygon(canvas, POLYGONS[polyKey], rule, 22, probe ?? undefined)
  }, [polyKey, rule, probe])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W
    const y = ((e.clientY - rect.top) / rect.height) * H
    setProbe({ x, y })
  }

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">点在多边形内</h1>
            <p className="text-gray-600">射线法与环绕数</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{POLY_LABEL[polyKey]} · {RULE_LABEL[rule]}</h3>
            <canvas ref={canvasRef} width={W} height={H} onClick={handleClick} className="w-full rounded-lg bg-slate-50 cursor-crosshair" />
            <p className="text-xs text-gray-400 mt-2">点击画布放置探针，绿色=在内、红色=在外，橙线为向右射线。</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择多边形</h3>
              <div className="space-y-2">
                {POLYGON_KEYS.map((k) => (
                  <button key={k} onClick={() => setPolyKey(k)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${polyKey === k ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    {POLY_LABEL[k]}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">判定规则</h3>
              <div className="space-y-2">
                {(['ray', 'winding'] as Rule[]).map((r) => (
                  <button key={r} onClick={() => setRule(r)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${rule === r ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}>
                    {RULE_LABEL[r]}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 射线法：向右数交点，奇数在内、偶数在外。</li>
                <li>• 环绕数：多边形绕点转几圈，非零即在内。</li>
                <li>• 凸多边形两法一致；<b>自交五角星</b>的星芯，两法结论相反。</li>
                <li>• 游戏碰撞、GIS 落区判断都靠它。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
