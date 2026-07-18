import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { orthogonalProjectionNarration } from '../../narrations/scripts/orthogonal-projection'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLES, projectOnto, residual, dot, dirFromAngle } from './orthogonalProjection'
import { drawOrthogonalProjection } from './draw'

const W = 600
const H = 480

export default function OrthogonalProjectionExperiment() {
  const [idx, setIdx] = useState(0)
  const [angle, setAngle] = useState(SAMPLES[0].angleDeg)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(orthogonalProjectionNarration)
  }, [narration])

  const sample = SAMPLES[idx]
  const v = { x: sample.vx, y: sample.vy }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawOrthogonalProjection(canvas, { x: sample.vx, y: sample.vy }, angle)
  }, [sample.vx, sample.vy, angle])

  const u = dirFromAngle((angle * Math.PI) / 180)
  const proj = projectOnto(v, u)
  const r = residual(v, u)
  const rDotU = dot(r, u)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">正交投影</h1>
            <p className="text-gray-600">向子空间的最近点</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">向量 v 到直线的投影与残差</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择向量 v</h3>
              <div className="space-y-2">
                {SAMPLES.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => { setIdx(i); setAngle(s.angleDeg) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {s.label} · v=({s.vx}, {s.vy})
                  </button>
                ))}
              </div>
              <label className="block mt-4 text-sm font-medium text-gray-700">直线角度: {angle}°</label>
              <input type="range" min={0} max={180} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full mt-1" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">实时数据</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>投影 proj = ({proj.x.toFixed(2)}, {proj.y.toFixed(2)})</li>
                <li>残差 r = ({r.x.toFixed(2)}, {r.y.toFixed(2)})</li>
                <li>残差·方向 = <b>{rDotU.toFixed(4)}</b>（≈0 即正交）</li>
                <li>公式：proj = (v·u / u·u) u</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
