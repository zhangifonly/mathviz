import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { solidOfRevolutionNarration } from '../../narrations/scripts/solid-of-revolution'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FUNCTIONS, INTERVALS, findCurve, diskVolume, shellVolume } from './solidOfRevolution'
import { drawSolidOfRevolution } from './draw'

const W = 600
const H = 480

export default function SolidOfRevolutionExperiment() {
  const [curveId, setCurveId] = useState('sqrt')
  const [b, setB] = useState(4)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const curve = findCurve(curveId)
  const right = Math.min(b, curve.b)
  const disk = diskVolume(curve.fn, curve.a, right, 400)
  const shell = shellVolume(curve.fn, curve.a, right, 400)

  useEffect(() => {
    if (narration) narration.loadScript(solidOfRevolutionNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawSolidOfRevolution(canvas, curve.fn, curve.a, right, 22)
  }, [curve, right])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">旋转体体积</h1>
            <p className="text-gray-600">圆盘法与壳层法</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{curve.label} 绕 x 轴旋转</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择曲线</h3>
              <div className="space-y-2">
                {FUNCTIONS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setCurveId(c.id); setB(Math.min(b, c.b)) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${curveId === c.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">积分右端点 b</h3>
              <div className="flex gap-2">
                {INTERVALS.map((v) => (
                  <button
                    key={v}
                    disabled={v > curve.b}
                    onClick={() => setB(v)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${right === v ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-40'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">两法对比</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 圆盘法 V = ∫π f(x)² dx = <b>{disk.toFixed(3)}</b></li>
                <li>• 壳层法 V = ∫2πy L(y) dy = <b>{shell.toFixed(3)}</b></li>
                <li>• 同一立体，两法结果<b>一致</b>。</li>
                <li>• 圆盘沿 x 切片，壳层沿 y 套筒。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
