import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { ellipticCurveNarration } from '../../narrations/scripts/elliptic-curve'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { CURVES, curveY, pointAdd, type Point } from './ellipticCurve'
import { drawEllipticCurve } from './draw'

const W = 600
const H = 480

export default function EllipticCurveExperiment() {
  const [ci, setCi] = useState(0)
  const [xp, setXp] = useState(-1)
  const [xq, setXq] = useState(1.5)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(ellipticCurveNarration)
  }, [narration])

  const curve = CURVES[ci]
  const yp = curveY(curve, xp)
  const yq = curveY(curve, xq)
  const P: Point | null = yp === null ? null : { x: xp, y: yp }
  const Q: Point | null = yq === null ? null : { x: xq, y: yq }
  const sum = P && Q ? pointAdd(curve, P, Q) : null

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const c = CURVES[ci]
    const py = curveY(c, xp)
    const qy = curveY(c, xq)
    drawEllipticCurve(canvas, c, py === null ? null : { x: xp, y: py }, qy === null ? null : { x: xq, y: qy }, true)
  }, [ci, xp, xq])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">椭圆曲线</h1>
            <p className="text-gray-600">曲线上点的加法群</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">y² = x³ + ({curve.a})x + ({curve.b})</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择曲线</h3>
              <div className="space-y-2">
                {CURVES.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setCi(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${ci === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    a={c.a}, b={c.b}
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <label className="block">P 的 x 坐标：{xp.toFixed(2)}
                  <input type="range" min={-2} max={2} step={0.05} value={xp} onChange={(e) => setXp(Number(e.target.value))} className="w-full" />
                </label>
                <label className="block">Q 的 x 坐标：{xq.toFixed(2)}
                  <input type="range" min={-2} max={2} step={0.05} value={xq} onChange={(e) => setXq(Number(e.target.value))} className="w-full" />
                </label>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">P + Q</h3>
              <p className="text-sm text-gray-600">
                {sum ? `坐标 (${sum.x.toFixed(2)}, ${sum.y.toFixed(2)})` : (P && Q ? '结果为无穷远点 O' : '当前 x 不在曲线上，请调整滑块')}
              </p>
              <ul className="text-sm text-gray-600 space-y-1.5 mt-3">
                <li>• 过 P、Q 作直线，交曲线于第三点。</li>
                <li>• 该点关于 x 轴对称即得 <b>P+Q</b>。</li>
                <li>• 无穷远点 O 是群的单位元。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
